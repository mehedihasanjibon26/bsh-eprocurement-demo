<?php

namespace Tests\Feature;

use App\Models\Requisition;
use App\Models\Tender;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_requires_authentication_and_rejects_vendor_and_unknown_roles(): void
    {
        $this->getJson('/api/dashboard/admin')->assertUnauthorized();
        $this->withToken('invalid-token')->getJson('/api/dashboard/admin')->assertUnauthorized();
        foreach (['vendor', 'unknown'] as $role) {
            $this->app['auth']->forgetGuards();
            $token = User::factory()->create(['role' => $role])->createToken('dashboard-test')->plainTextToken;
            $this->withToken($token)->getJson('/api/dashboard/admin')->assertForbidden()->assertJsonMissingPath('data');
        }
    }

    public function test_all_internal_roles_can_read_an_empty_dashboard(): void
    {
        foreach (['admin', 'approver', 'evaluator', 'management_viewer'] as $role) {
            $this->app['auth']->forgetGuards();
            $token = User::factory()->create(['role' => $role])->createToken('dashboard-test')->plainTextToken;
            $this->withToken($token)->getJson('/api/dashboard/admin')->assertOk()
                ->assertJsonPath('data.kpis', ['pending_requisitions' => 0, 'active_tenders' => 0, 'approved_vendors' => 0, 'under_evaluation' => 0])
                ->assertJsonPath('data.tenders', [])
                ->assertJsonPath('data.tender_status', [])
                ->assertJsonPath('data.recent_activity', [])
                ->assertJsonPath('data.alerts', [])
                ->assertJsonCount(6, 'data.demo.activity_trend')
                ->assertJsonPath('data.demo.alerts.0.source', 'demo');
        }
    }

    public function test_dashboard_aggregates_records_and_updates_without_dashboard_entities(): void
    {
        $this->travelTo(now()->startOfSecond());
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $requisition = Requisition::create([
            'requisition_number' => 'PR-001', 'title' => 'ICU Equipment Purchase Requisition',
            'department' => 'ICU', 'category' => 'medical_equipment', 'requester' => 'ICU Department',
            'estimated_budget' => 5000000, 'required_date' => now()->addDays(30), 'status' => 'pending_approval',
        ]);
        foreach (['approved', 'pending_verification', 'suspended'] as $index => $status) {
            Vendor::create(['name' => 'Hospital supplier '.$index, 'category' => 'medical_equipment', 'status' => $status,
                'document_expiry_alert' => $index === 0 ? 'Trade license expires in 30 days' : null]);
        }
        foreach (['published', 'bidding_open', 'evaluation', 'draft', 'awarded', 'closed', 'cancelled', 'published'] as $index => $status) {
            $this->createTender($index, $status, $index === 7 ? now()->subDay() : now()->addDays(5));
        }
        $this->createTender(8, 'published', null);

        $response = $this->getJson('/api/dashboard/admin')->assertOk()
            ->assertJsonPath('data.kpis', ['pending_requisitions' => 1, 'active_tenders' => 3, 'approved_vendors' => 1, 'under_evaluation' => 1])
            ->assertJsonCount(8, 'data.tenders')
            ->assertJsonCount(6, 'data.recent_activity')
            ->assertJsonCount(4, 'data.alerts');
        $this->assertSame(9, array_sum(array_column($response->json('data.tender_status'), 'count')));
        $this->assertSame([9, 2, 1], array_column(array_slice($response->json('data.tenders'), 0, 3), 'id'));
        $this->assertNull($response->json('data.tenders.0.closing_date'));
        $this->assertSame(3, Tender::where('status', 'published')->count());
        $this->assertDatabaseCount('requisitions', 1);
        $this->assertDatabaseCount('vendors', 3);

        $requisition->update(['status' => 'approved']);
        Tender::where('status', 'evaluation')->update(['status' => 'awarded']);
        $this->getJson('/api/dashboard/admin')->assertOk()
            ->assertJsonPath('data.kpis.pending_requisitions', 0)
            ->assertJsonPath('data.kpis.under_evaluation', 0);
    }

    public function test_deadline_boundary_and_recent_activity_ordering(): void
    {
        $this->travelTo(now()->startOfSecond());
        $this->actingAs(User::factory()->create(['role' => 'evaluator']));
        $this->createTender(0, 'published', now());
        $this->createTender(1, 'published', now()->addDays(7));
        $this->createTender(2, 'published', now()->addDays(7)->addSecond());
        $this->travel(1)->minutes();
        Tender::where('tender_number', 'TN-0')->first()->update(['title' => 'Recently updated ICU tender']);
        $this->getJson('/api/dashboard/admin')->assertOk()
            ->assertJsonPath('data.kpis.active_tenders', 2)
            ->assertJsonPath('data.recent_activity.0.title', 'Recently updated ICU tender');
        $this->travelBack();
    }

    private function createTender(int $index, string $status, $closingDate): void
    {
        Tender::create(['tender_number' => 'TN-'.$index, 'title' => 'Hospital procurement '.$index,
            'category' => 'medical_equipment', 'type' => 'public_tender', 'closing_date' => $closingDate,
            'status' => $status, 'bid_count' => 3]);
    }
}
