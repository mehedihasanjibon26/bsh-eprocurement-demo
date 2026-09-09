<?php

namespace Tests\Feature;

use App\Models\Requisition;
use App\Models\Tender;
use App\Models\User;
use App\Models\Vendor;
use Database\Seeders\PhaseThreeDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenderWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function form(): array
    {
        return ['title' => 'ICU Equipment Supply 2026', 'category' => 'medical_equipment', 'type' => 'public_tender', 'scope' => 'Supply and install ICU equipment.', 'eligibility' => 'Trade license, TIN and manufacturer authorization.', 'closing_date' => now()->addDays(14)->toIso8601String(), 'documents' => ['Technical specifications'], 'invited_vendor_ids' => [],
            'boq' => [['name' => 'ICU ventilator', 'specification' => 'Adult and paediatric modes', 'quantity' => 2, 'unit' => 'unit', 'unit_cost' => 1500000]]];
    }

    public function test_tender_create_edit_publish_and_governance(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $id = $this->postJson('/api/tenders', $this->form())->assertCreated()->assertJsonPath('data.bid_count', 0)->json('data.id');
        $url = '/api/tenders/'.$id;
        $this->putJson($url, $this->form())->assertOk();
        $this->postJson($url.'/actions', ['action' => 'publish'])->assertConflict();
        $this->postJson($url.'/actions', ['action' => 'submit'])->assertOk()->assertJsonPath('data.status', 'pending_approval');
        $this->actingAs(User::factory()->create(['role' => 'approver']));
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertOk()->assertJsonPath('data.status', 'approved');
        $this->postJson($url.'/actions', ['action' => 'publish'])->assertForbidden();
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson($url.'/actions', ['action' => 'publish'])->assertOk()->assertJsonPath('data.status', 'published');
        $this->putJson($url, $this->form())->assertConflict();
        $this->postJson($url.'/actions', ['action' => 'clarification', 'note' => 'Installation and training are included.'])->assertOk()->assertJsonCount(1, 'data.clarifications');
        $this->postJson($url.'/actions', ['action' => 'addendum', 'note' => 'Warranty increased to 24 months.'])->assertOk()->assertJsonCount(1, 'data.addenda');
        $this->postJson($url.'/actions', ['action' => 'extend_deadline', 'note' => 'Supplier request', 'closing_date' => now()->addDay()->toIso8601String()])->assertUnprocessable();
        $this->postJson($url.'/actions', ['action' => 'extend_deadline', 'note' => 'Supplier request', 'closing_date' => now()->addDays(21)->toIso8601String()])->assertOk();
        $this->postJson($url.'/actions', ['action' => 'cancel'])->assertUnprocessable();
        $this->postJson($url.'/actions', ['action' => 'cancel', 'note' => 'Hospital scope revised.'])->assertOk()->assertJsonPath('data.status', 'cancelled');
        $this->postJson($url.'/actions', ['action' => 'publish'])->assertConflict();
        $this->getJson($url)->assertOk()->assertJsonCount(9, 'data.history');
    }

    public function test_invited_vendor_and_validation_guards(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/tenders', [])->assertUnprocessable();
        $form = array_replace($this->form(), ['type' => 'invited_tender']);
        $id = $this->postJson('/api/tenders', $form)->assertCreated()->json('data.id');
        $this->postJson('/api/tenders/'.$id.'/actions', ['action' => 'submit'])->assertUnprocessable();
        $vendor = Vendor::create(['name' => 'MediSupply Ltd.', 'category' => 'medical_equipment', 'status' => 'approved']);
        $form['invited_vendor_ids'] = [$vendor->id];
        $this->putJson('/api/tenders/'.$id, $form)->assertOk();
        $this->postJson('/api/tenders/'.$id.'/actions', ['action' => 'submit'])->assertOk();
        $this->postJson('/api/tenders/'.$id.'/actions', ['action' => 'approve'])->assertOk();
        $vendor->update(['status' => 'suspended']);
        $this->postJson('/api/tenders/'.$id.'/actions', ['action' => 'publish'])->assertUnprocessable();
        foreach (['evaluator', 'management_viewer', 'vendor'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role]));
            $this->postJson('/api/tenders', $this->form())->assertForbidden();
            $this->postJson('/api/tenders/'.$id.'/actions', ['action' => 'approve'])->assertForbidden();
        }
        $this->getJson('/api/tenders')->assertForbidden();
    }

    public function test_golden_demo_reuses_seeded_tender_and_can_publish(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $request = Requisition::create(['requisition_number' => 'PR-001', 'department' => 'ICU', 'title' => 'ICU Equipment Purchase Requisition', 'category' => 'medical_equipment', 'requester' => 'ICU Department', 'estimated_budget' => 5000000, 'required_date' => now()->addDays(30), 'status' => 'pending_approval']);
        $tender = Tender::create(['tender_number' => 'TN-ICU-2026-001', 'title' => 'ICU Equipment Supply 2026', 'category' => 'medical_equipment', 'type' => 'public_tender', 'closing_date' => now()->addDays(7), 'status' => 'evaluation', 'bid_count' => 3]);
        $this->seed(PhaseThreeDemoSeeder::class);
        $this->postJson('/api/requisitions/'.$request->id.'/actions', ['action' => 'approve'])->assertOk();
        $this->postJson('/api/requisitions/'.$request->id.'/convert', ['title' => $tender->title, 'type' => 'public_tender', 'closing_date' => now()->addDays(14)->toIso8601String()])->assertCreated()->assertJsonPath('data.id', $tender->id);
        foreach (['submit', 'approve', 'publish'] as $action) {
            $this->postJson('/api/tenders/'.$tender->id.'/actions', ['action' => $action])->assertOk();
        }
        $this->seed(PhaseThreeDemoSeeder::class);
        $this->getJson('/api/tenders/'.$tender->id)->assertJsonPath('data.status', 'published')->assertJsonPath('data.requisition_id', $request->id);
        $this->assertDatabaseCount('tenders', 1);
    }
}
