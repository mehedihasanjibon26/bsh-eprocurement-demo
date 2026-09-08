<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE vendors RESTART IDENTITY CASCADE');

        Vendor::query()->create([
            'name' => 'MediSupply Ltd.',
            'category' => 'medical_equipment',
            'status' => 'approved',
            'performance_score' => 4.6,
            'document_expiry_alert' => 'Trade License expires in 30 days',
        ]);

        Vendor::query()->create([
            'name' => 'HealthTech Traders',
            'category' => 'medical_equipment',
            'status' => 'approved',
            'performance_score' => 4.4,
            'document_expiry_alert' => null,
        ]);

        Vendor::query()->create([
            'name' => 'CarePoint Distributors',
            'category' => 'medical_consumables',
            'status' => 'approved',
            'performance_score' => 4.2,
            'document_expiry_alert' => null,
        ]);

        Vendor::query()->create([
            'name' => 'Bangla Diagnostic Solutions',
            'category' => 'diagnostic_reagents',
            'status' => 'pending_verification',
            'performance_score' => null,
            'document_expiry_alert' => 'Verification documents incomplete',
        ]);

        Vendor::query()->create([
            'name' => 'MedEquip Bangladesh',
            'category' => 'medical_equipment',
            'status' => 'suspended',
            'performance_score' => 3.8,
            'document_expiry_alert' => 'Lifecycle control example',
        ]);
    }
}
