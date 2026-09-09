<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use App\Models\Tender;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['admin', 'approver', 'evaluator', 'management_viewer'], true), 403, 'Hospital dashboard access is required.');

        $now = now();
        $requisitions = Requisition::query()->orderByDesc('updated_at')->orderByDesc('id')->get();
        $vendors = Vendor::query()->orderByDesc('updated_at')->orderByDesc('id')->get();
        $tenders = Tender::query()->orderByDesc('updated_at')->orderByDesc('id')->get();
        $pending = $requisitions->where('status', 'pending_approval');
        // Active means accepting bids with an upcoming deadline (or no deadline).
        $active = $tenders->filter(fn (Tender $tender) => in_array($tender->status, ['published', 'bidding_open'], true)
            && ($tender->closing_date === null || $tender->closing_date->gt($now)));

        // Latest record snapshots, not an audit trail or invented status transitions.
        $activity = collect();
        foreach (['requisition' => $requisitions, 'tender' => $tenders, 'vendor' => $vendors] as $kind => $records) {
            foreach ($records as $record) {
                $activity->push([
                    'id' => $kind.'-'.$record->id,
                    'kind' => $kind,
                    'title' => $record->title ?? $record->name,
                    'reference' => $record->requisition_number ?? $record->tender_number ?? 'Vendor record',
                    'status' => $record->status,
                    'updated_at' => $record->updated_at?->toIso8601String(),
                ]);
            }
        }

        $alerts = collect();
        if ($pending->isNotEmpty()) {
            $alerts->push(['id' => 'requisition-approvals', 'title' => 'Requisition approvals', 'description' => $pending->count().' requisition(s) awaiting approval.', 'kind' => 'approval', 'source' => 'database']);
        }
        foreach ($vendors->filter(fn (Vendor $vendor) => filled($vendor->document_expiry_alert)) as $vendor) {
            $alerts->push(['id' => 'vendor-'.$vendor->id, 'title' => $vendor->name, 'description' => $vendor->document_expiry_alert, 'kind' => 'document', 'source' => 'database']);
        }
        foreach ($active->filter(fn (Tender $tender) => $tender->closing_date?->lte($now->copy()->addDays(7))) as $tender) {
            $alerts->push(['id' => 'tender-'.$tender->id, 'title' => 'Tender closing soon', 'description' => $tender->title.' closes '.$tender->closing_date->timezone('Asia/Dhaka')->format('d M Y, H:i').' (Dhaka).', 'kind' => 'deadline', 'source' => 'database']);
        }

        return response()->json(['data' => [
            'generated_at' => $now->toIso8601String(),
            'kpis' => [
                'pending_requisitions' => $pending->count(),
                'active_tenders' => $active->count(),
                'approved_vendors' => $vendors->where('status', 'approved')->count(),
                'under_evaluation' => $tenders->where('status', 'evaluation')->count(),
            ],
            'tender_status' => $tenders->groupBy('status')->map(fn ($items, $status) => ['status' => $status, 'count' => $items->count()])->values(),
            'recent_activity' => $activity->sortByDesc('updated_at')->take(6)->values(),
            'alerts' => $alerts->values(),
            'tenders' => $tenders->sortByDesc(fn (Tender $tender) => $active->contains('id', $tender->id))->take(8)->values()->map(fn (Tender $tender) => [
                'id' => $tender->id,
                'tender_number' => $tender->tender_number,
                'title' => $tender->title,
                'category' => $tender->category,
                'closing_date' => $tender->closing_date?->toIso8601String(),
                'status' => $tender->status,
                'bid_count' => $tender->bid_count,
            ]),
            'demo' => config('admin_dashboard'),
        ]]);
    }
}
