<?php

namespace Database\Seeders;

use App\Models\Tender;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TenderSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE tenders RESTART IDENTITY CASCADE');

        Tender::query()->create([
            'tender_number' => 'TN-ICU-2026-001',
            'title' => 'ICU Equipment Supply 2026',
            'category' => 'medical_equipment',
            'type' => 'public_tender',
            'closing_date' => now()->addDays(7),
            'status' => 'evaluation',
            'bid_count' => 3,
        ]);

        Tender::query()->create([
            'tender_number' => 'TN-MC-2026-002',
            'title' => 'Medical Consumables Procurement 2026',
            'category' => 'medical_consumables',
            'type' => 'public_tender',
            'closing_date' => now()->addDays(12),
            'status' => 'published',
            'bid_count' => 5,
        ]);

        Tender::query()->create([
            'tender_number' => 'TN-DR-2026-003',
            'title' => 'Diagnostic Reagents Supply',
            'category' => 'diagnostic_reagents',
            'type' => 'public_tender',
            'closing_date' => now()->addDays(10),
            'status' => 'published',
            'bid_count' => 4,
        ]);

        Tender::query()->create([
            'tender_number' => 'TN-HF-2026-004',
            'title' => 'Hospital Furniture Procurement',
            'category' => 'general_supplies',
            'type' => 'invited_tender',
            'closing_date' => now()->addDays(20),
            'status' => 'draft',
            'bid_count' => 0,
        ]);

        Tender::query()->create([
            'tender_number' => 'TN-AM-2026-005',
            'title' => 'Ambulance Maintenance Services',
            'category' => 'professional_services',
            'type' => 'rfq',
            'closing_date' => now()->subDays(15),
            'status' => 'awarded',
            'bid_count' => 3,
        ]);
    }
}
