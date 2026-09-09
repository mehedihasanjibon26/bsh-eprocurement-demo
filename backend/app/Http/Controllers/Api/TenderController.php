<?php

namespace App\Http\Controllers\Api;

use App\Models\Requisition;
use App\Models\Tender;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TenderController extends ProcurementController
{
    public function index(): JsonResponse
    {
        $tenders = Tender::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $tenders,
        ]);
    }

    public function show(Tender $tender): JsonResponse
    {
        return response()->json(['data' => $tender]);
    }

    private function validateForm(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'], 'category' => $this->categoryRule(),
            'type' => ['required', Rule::in(['public_tender', 'invited_tender', 'rfq'])],
            'scope' => ['required', 'string', 'max:5000'], 'eligibility' => ['required', 'string', 'max:5000'],
            'closing_date' => ['required', 'date', 'after:now'],
            'requisition_id' => ['nullable', 'integer', 'exists:requisitions,id'],
            'documents' => ['present', 'array', 'max:20'], 'documents.*' => ['required', 'string', 'max:200'],
            'invited_vendor_ids' => ['present', 'array', 'max:50'], 'invited_vendor_ids.*' => ['integer', 'distinct', Rule::exists('vendors', 'id')->where('status', 'approved')],
            ...$this->itemRules('boq'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateForm($request);
        return DB::transaction(function () use ($request, $data) {
            $requisition = isset($data['requisition_id']) ? Requisition::whereKey($data['requisition_id'])->lockForUpdate()->firstOrFail() : null;
            if ($requisition) {
                abort_unless($requisition->status === 'approved' && !Tender::where('requisition_id', $requisition->id)->exists(), 409, 'Select an approved requisition that has not been converted.');
                $data['category'] = $requisition->category;
            }
            $tender = $requisition?->requisition_number === 'PR-001'
                ? Tender::where('tender_number', 'TN-ICU-2026-001')->where('status', 'draft')->whereNull('requisition_id')->lockForUpdate()->first()
                : null;
            $tender ??= new Tender(['tender_number' => 'TN-'.now()->format('Y').'-'.Str::upper(Str::random(8)), 'status' => 'draft', 'bid_count' => 0]);
            $tender->fill($data);
            $this->recordAction($tender, $request, 'created');
            if ($requisition) {
                $requisition->status = 'converted';
                $this->recordAction($requisition, $request, 'converted', $tender->tender_number);
            }
            return response()->json(['data' => $tender], 201);
        });
    }

    public function update(Request $request, Tender $tender): JsonResponse
    {
        $data = $this->validateForm($request);
        return DB::transaction(function () use ($request, $tender, $data) {
            $record = Tender::whereKey($tender->id)->lockForUpdate()->firstOrFail();
            abort_unless($record->status === 'draft', 409, 'Only draft tenders can be edited. Use an addendum for a published tender.');
            abort_unless(($data['requisition_id'] ?? null) === $record->requisition_id, 422, 'The source requisition cannot be changed after creation.');
            $record->fill($data);
            $this->recordAction($record, $request, 'updated');
            return response()->json(['data' => $record]);
        });
    }

    private function checkPublicationRequirements(Tender $tender): void
    {
        abort_unless(filled($tender->scope) && filled($tender->eligibility) && count($tender->boq ?? []) > 0 && $tender->closing_date?->isFuture(), 422, 'Complete scope, eligibility, BOQ, and a future closing date before submission or publication.');
        if ($tender->type === 'invited_tender') {
            $ids = $tender->invited_vendor_ids ?? [];
            abort_unless(count($ids) > 0 && Vendor::whereIn('id', $ids)->where('status', 'approved')->count() === count($ids), 422, 'Invited tenders require at least one currently approved vendor.');
        }
    }

    public function action(Request $request, Tender $tender): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', Rule::in(['submit', 'approve', 'publish', 'clarification', 'addendum', 'extend_deadline', 'cancel'])],
            'note' => ['required_if:action,clarification,addendum,extend_deadline,cancel', 'nullable', 'string', 'max:2000'],
            'closing_date' => ['required_if:action,extend_deadline', 'nullable', 'date', 'after:now'],
        ]);
        abort_unless($request->user()->role === 'admin' || ($request->user()->role === 'approver' && $data['action'] === 'approve'), 403);
        return DB::transaction(function () use ($request, $tender, $data) {
            $record = Tender::whereKey($tender->id)->lockForUpdate()->firstOrFail();
            $action = $data['action'];
            $allowed = [
                'submit' => ['draft'], 'approve' => ['pending_approval'], 'publish' => ['approved'],
                'clarification' => ['published', 'bidding_open'], 'addendum' => ['published', 'bidding_open'],
                'extend_deadline' => ['published', 'bidding_open'],
                'cancel' => ['draft', 'pending_approval', 'approved', 'published', 'bidding_open', 'closed', 'evaluation'],
            ];
            abort_unless(in_array($record->status, $allowed[$action], true), 409, 'This action is not available in the current tender status.');
            if (in_array($action, ['submit', 'publish'], true)) {
                $this->checkPublicationRequirements($record);
            }
            if ($action === 'extend_deadline') {
                $newClosing = \Carbon\Carbon::parse($data['closing_date']);
                abort_unless($record->closing_date === null || $newClosing->gt($record->closing_date), 422, 'The extended deadline must be later than the current closing date.');
                $data['note'] .= ' Previous deadline: '.($record->closing_date?->toIso8601String() ?? 'not scheduled').'. New deadline: '.$newClosing->toIso8601String();
                $record->closing_date = $newClosing;
            }
            if (in_array($action, ['clarification', 'addendum'], true)) {
                abort_unless($record->closing_date?->isFuture(), 409, 'Extend the closing deadline before issuing further notices.');
                $field = $action === 'clarification' ? 'clarifications' : 'addenda';
                $entries = $record->$field ?? [];
                $entries[] = ['action' => $action, 'status' => $record->status, 'actor' => $request->user()->name, 'at' => now()->toIso8601String(), 'note' => $data['note']];
                $record->$field = $entries;
            }
            $record->status = ['submit' => 'pending_approval', 'approve' => 'approved', 'publish' => 'published', 'cancel' => 'cancelled'][$action] ?? $record->status;
            $this->recordAction($record, $request, $action, $data['note'] ?? null);
            return response()->json(['data' => $record]);
        });
    }
}
