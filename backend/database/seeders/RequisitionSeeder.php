<?php

namespace Database\Seeders;

use App\Models\Requisition;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequisitionSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE requisitions RESTART IDENTITY CASCADE');

        Requisition::query()->create([
            'requisition_number' => 'PR-001',
            'department' => 'Intensive Care Unit (ICU)',
            'title' => 'ICU Equipment Purchase Requisition',
            'category' => 'medical_equipment',
            'requester' => 'ICU Department',
            'estimated_budget' => 5000000.00,
            'required_date' => now()->addDays(30)->toDateString(),
            'status' => 'converted',
        ]);
    }
}
