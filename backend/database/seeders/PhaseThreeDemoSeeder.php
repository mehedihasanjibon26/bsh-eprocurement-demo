<?php

namespace Database\Seeders;

use App\Models\Requisition;
use App\Models\Tender;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class PhaseThreeDemoSeeder extends Seeder
{
    public function run(): void
    {
        $requisition = Requisition::where('requisition_number', 'PR-001')->first();
        if ($requisition && $requisition->items === null) {
            $requisition->update(['description' => 'Equip the expanded Intensive Care Unit at Bangladesh Specialized Hospital PLC with ventilators and patient monitors, including installation, training and warranty support.', 'items' => config('procurement_demo.icu_items'), 'history' => []]);
        }
        foreach (Vendor::whereNull('profile')->get() as $index => $vendor) {
            $number = str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);
            $vendor->update(['profile' => [
                'address' => 'Dhaka, Bangladesh', 'contact' => 'Institutional Supply Desk',
                'email' => 'supplier'.$number.'@bsh-demo.example', 'phone' => '+880 1XXX-XXX'.$number,
                'registration' => 'DEMO-TL-2026-'.$number, 'tax' => 'DEMO-TIN-'.$number.' / DEMO-BIN-'.$number,
                'bank' => 'Sample commercial bank · Dhaka branch', 'account' => '•••• •••• '.$number,
                'verified' => $vendor->status === 'approved',
                'documents' => [
                    ['name' => 'Trade license', 'status' => 'Sample copy on file', 'expiry' => now()->addDays($vendor->name === 'MediSupply Ltd.' ? 30 : 180)->toDateString()],
                    ['name' => 'TIN and BIN certificates', 'status' => $vendor->status === 'pending_verification' ? 'Review required' : 'Sample copy on file', 'expiry' => null],
                    ['name' => 'Bank account confirmation', 'status' => 'Sample copy on file', 'expiry' => null],
                ],
            ], 'history' => []]);
        }
        foreach (Tender::whereNull('scope')->get() as $tender) {
            $icu = $tender->tender_number === 'TN-ICU-2026-001';
            $item = config('procurement_demo.tender_items.'.$tender->category);
            $boq = $icu ? config('procurement_demo.icu_items') : ($item ? [array_combine(['name', 'specification', 'quantity', 'unit', 'unit_cost'], $item)] : []);
            $updates = ['scope' => $icu ? $requisition?->description : 'Supply and support for '.$tender->title.' at Bangladesh Specialized Hospital PLC.', 'eligibility' => config('procurement_demo.eligibility'), 'boq' => $boq, 'documents' => config('procurement_demo.documents'), 'invited_vendor_ids' => [], 'clarifications' => [], 'addenda' => [], 'history' => []];
            // Prepare only the untouched foundation scenario for the Phase 3 golden flow.
            if ($icu && $tender->status === 'evaluation' && $tender->bid_count === 3 && $requisition?->status === 'pending_approval') {
                $updates += ['status' => 'draft', 'bid_count' => 0];
            }
            $tender->update($updates);
        }
    }
}
