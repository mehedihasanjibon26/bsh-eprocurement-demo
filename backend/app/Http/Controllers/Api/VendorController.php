<?php

namespace App\Http\Controllers\Api;

use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VendorController extends ProcurementController
{
    public function index(): JsonResponse
    {
        $vendors = Vendor::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $vendors,
        ]);
    }

    public function show(Vendor $vendor): JsonResponse
    {
        return response()->json(['data' => $vendor]);
    }

    public function action(Request $request, Vendor $vendor): JsonResponse
    {
        $data = $request->validate(['action' => ['required', Rule::in(['verify', 'approve', 'suspend', 'blacklist'])], 'note' => ['required_if:action,suspend,blacklist', 'nullable', 'string', 'max:2000']]);
        return DB::transaction(function () use ($request, $vendor, $data) {
            $record = Vendor::whereKey($vendor->id)->lockForUpdate()->firstOrFail();
            $allowed = ['verify' => ['pending_verification', 'approved', 'suspended'], 'approve' => ['pending_verification', 'suspended'], 'suspend' => ['approved'], 'blacklist' => ['pending_verification', 'approved', 'suspended']];
            abort_unless(in_array($record->status, $allowed[$data['action']], true), 409, 'This vendor lifecycle action is unavailable in the current status.');
            if ($data['action'] === 'verify') {
                abort_unless($record->profile, 422, 'Company compliance details must be present before verification.');
                $profile = $record->profile;
                $profile['verified'] = true;
                // A controlled demo check, not an external tax or banking integration.
                $record->profile = $profile;
            } else {
                if ($data['action'] === 'approve') {
                    abort_unless($record->profile['verified'] ?? false, 422, 'Run the simulated compliance verification before approval.');
                }
                $record->status = ['approve' => 'approved', 'suspend' => 'suspended', 'blacklist' => 'blacklisted'][$data['action']];
            }
            $this->recordAction($record, $request, $data['action'], $data['note'] ?? ($data['action'] === 'verify' ? 'Simulated tax and banking verification.' : null));
            return response()->json(['data' => $record]);
        });
    }
}
