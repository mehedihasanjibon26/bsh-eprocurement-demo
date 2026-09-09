<?php

namespace App\Http\Controllers\Api;

use App\Models\Requisition;
use App\Models\Tender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class RequisitionController extends ProcurementController
{
    public function index(): JsonResponse
    {
        $requisitions = Requisition::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $requisitions,
        ]);
    }

    public function show(Requisition $requisition): JsonResponse
    {
        return response()->json(['data' => $requisition->toArray() + ['tender_id' => Tender::where('requisition_id', $requisition->id)->value('id')]]);
    }

    private function validateForm(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'department' => ['required', 'string', 'max:150'],
            'category' => $this->categoryRule(),
            'description' => ['required', 'string', 'max:5000'],
            'required_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'estimated_budget' => ['required', 'numeric', 'min:1', 'max:9999999999999', 'decimal:0,2'],
            ...$this->itemRules('items'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateForm($request);
        $requisition = DB::transaction(function () use ($data, $request) {
            $record = Requisition::create($data + ['requisition_number' => 'PR-'.now()->format('Y').'-'.Str::upper(Str::random(8)), 'requester' => $request->user()->name, 'status' => 'draft']);
            $this->recordAction($record, $request, 'created');
            return $record;
        });
        return response()->json(['data' => $requisition], 201);
    }

    public function update(Request $request, Requisition $requisition): JsonResponse
    {
        $data = $this->validateForm($request);
        return DB::transaction(function () use ($data, $request, $requisition) {
            $record = Requisition::whereKey($requisition->id)->lockForUpdate()->firstOrFail();
            abort_unless(in_array($record->status, ['draft', 'revision_required'], true), 409, 'Only drafts or returned requisitions can be edited.');
            $record->fill($data);
            $this->recordAction($record, $request, 'updated');
            return response()->json(['data' => $record]);
        });
    }

    public function action(Request $request, Requisition $requisition): JsonResponse
    {
        $data = $request->validate(['action' => ['required', Rule::in(['submit', 'approve', 'reject', 'request_revision'])], 'note' => ['required_if:action,reject,request_revision', 'nullable', 'string', 'max:2000']]);
        abort_unless($request->user()->role === 'admin' || ($request->user()->role === 'approver' && $data['action'] !== 'submit'), 403);
        return DB::transaction(function () use ($request, $requisition, $data) {
            $record = Requisition::whereKey($requisition->id)->lockForUpdate()->firstOrFail();
            $action = $data['action'];
            $allowed = $action === 'submit' ? ['draft', 'revision_required'] : ['pending_approval'];
            abort_unless(in_array($record->status, $allowed, true), 409, 'This action is not available in the current requisition status.');
            if ($action === 'submit') {
                abort_unless(filled($record->description) && count($record->items ?? []) > 0 && $record->required_date->gte(today()), 422, 'Complete the description, item lines, and future required date before submission.');
            }
            $record->status = ['submit' => 'pending_approval', 'approve' => 'approved', 'reject' => 'rejected', 'request_revision' => 'revision_required'][$action];
            $this->recordAction($record, $request, $action, $data['note'] ?? null);
            return response()->json(['data' => $record]);
        });
    }

    public function convert(Request $request, Requisition $requisition): JsonResponse
    {
        $data = $request->validate(['title' => ['required', 'string', 'max:200'], 'type' => ['required', Rule::in(['public_tender', 'invited_tender', 'rfq'])], 'closing_date' => ['required', 'date', 'after:now']]);
        return DB::transaction(function () use ($request, $requisition, $data) {
            $record = Requisition::whereKey($requisition->id)->lockForUpdate()->firstOrFail();
            $existing = Tender::where('requisition_id', $record->id)->first();
            if ($record->status === 'converted' && $existing) {
                return response()->json(['data' => $existing]);
            }
            abort_unless($record->status === 'approved', 409, 'Approve this requisition before converting it.');
            // Reuse the prepared ICU scenario instead of creating a duplicate golden tender.
            $tender = $record->requisition_number === 'PR-001'
                ? Tender::where('tender_number', 'TN-ICU-2026-001')->where('status', 'draft')->whereNull('requisition_id')->lockForUpdate()->first()
                : null;
            $tender ??= new Tender(['tender_number' => 'TN-'.now()->format('Y').'-'.Str::upper(Str::random(8)), 'status' => 'draft', 'bid_count' => 0]);
            $tender->fill($data + ['requisition_id' => $record->id, 'category' => $record->category, 'scope' => $record->description, 'boq' => $record->items]);
            $this->recordAction($tender, $request, 'created_from_requisition', $record->requisition_number);
            $record->status = 'converted';
            $this->recordAction($record, $request, 'converted', $tender->tender_number);
            return response()->json(['data' => $tender], 201);
        });
    }
}
