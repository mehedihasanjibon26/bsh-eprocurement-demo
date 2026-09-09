<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RequisitionWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function form(): array
    {
        return ['title' => 'ICU equipment request', 'department' => 'ICU', 'category' => 'medical_equipment', 'description' => 'Ventilators for ICU expansion.', 'required_date' => now()->addDays(30)->toDateString(), 'estimated_budget' => 5000000,
            'items' => [['name' => 'ICU ventilator', 'specification' => 'Adult and paediatric ventilation', 'quantity' => 2, 'unit' => 'unit', 'unit_cost' => 2500000]]];
    }

    public function test_create_revision_approval_and_idempotent_conversion(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $id = $this->postJson('/api/requisitions', $this->form())->assertCreated()->assertJsonPath('data.status', 'draft')->json('data.id');
        $url = '/api/requisitions/'.$id;
        $conversion = ['title' => 'ICU Equipment Supply 2026', 'type' => 'rfq', 'closing_date' => now()->addDays(14)->toIso8601String()];
        $this->postJson($url.'/convert', $conversion)->assertConflict();
        $this->postJson($url.'/actions', ['action' => 'submit'])->assertOk()->assertJsonPath('data.status', 'pending_approval');
        $this->putJson($url, $this->form())->assertConflict();
        $this->postJson($url.'/actions', ['action' => 'request_revision'])->assertUnprocessable();
        $this->postJson($url.'/actions', ['action' => 'request_revision', 'note' => 'Include installation requirements.'])->assertOk()->assertJsonPath('data.status', 'revision_required');
        $this->putJson($url, $this->form())->assertOk();
        $this->postJson($url.'/actions', ['action' => 'submit'])->assertOk();
        $this->actingAs(User::factory()->create(['role' => 'approver']));
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertOk()->assertJsonPath('data.status', 'approved');
        $this->postJson($url.'/convert', $conversion)->assertForbidden();
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $tender = $this->postJson($url.'/convert', $conversion)->assertCreated()->assertJsonPath('data.status', 'draft')->assertJsonPath('data.boq.0.quantity', 2)->json('data.id');
        $this->postJson($url.'/convert', $conversion)->assertOk()->assertJsonPath('data.id', $tender);
        $this->getJson($url)->assertOk()->assertJsonPath('data.status', 'converted')->assertJsonPath('data.tender_id', $tender)->assertJsonCount(7, 'data.history');
        $this->assertDatabaseCount('tenders', 1);
    }

    public function test_rejection_validation_and_role_boundaries(): void
    {
        $this->getJson('/api/requisitions')->assertUnauthorized();
        foreach (['vendor', 'evaluator', 'management_viewer'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role]));
            $this->postJson('/api/requisitions', $this->form())->assertForbidden();
        }
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/requisitions', [])->assertUnprocessable();
        $this->postJson('/api/requisitions', array_replace($this->form(), ['items' => []]))->assertUnprocessable();
        $id = $this->postJson('/api/requisitions', $this->form())->json('data.id');
        $this->postJson('/api/requisitions/'.$id.'/actions', ['action' => 'submit'])->assertOk();
        $this->postJson('/api/requisitions/'.$id.'/actions', ['action' => 'reject', 'note' => 'Budget allocation unavailable.'])->assertOk()->assertJsonPath('data.status', 'rejected');
        $this->postJson('/api/requisitions/'.$id.'/actions', ['action' => 'approve'])->assertConflict();
        $this->getJson('/api/requisitions/999999')->assertNotFound();
    }
}
