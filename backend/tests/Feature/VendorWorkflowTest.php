<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vendor;
use Database\Seeders\PhaseThreeDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_verification_approval_suspension_and_blacklist(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $vendor = Vendor::create(['name' => 'Bangla Diagnostic Solutions', 'category' => 'diagnostic_reagents', 'status' => 'pending_verification', 'performance_score' => 4.4, 'document_expiry_alert' => 'Verification documents incomplete']);
        $this->seed(PhaseThreeDemoSeeder::class);
        $url = '/api/vendors/'.$vendor->id;
        $this->getJson($url)->assertOk()->assertJsonPath('data.profile.verified', false)->assertJsonPath('data.performance_score', '4.4');
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertUnprocessable();
        $this->postJson($url.'/actions', ['action' => 'verify'])->assertOk()->assertJsonPath('data.profile.verified', true);
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertOk()->assertJsonPath('data.status', 'approved');
        $this->postJson($url.'/actions', ['action' => 'suspend'])->assertUnprocessable();
        $this->postJson($url.'/actions', ['action' => 'suspend', 'note' => 'Compliance review required.'])->assertOk()->assertJsonPath('data.status', 'suspended');
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertOk();
        $this->postJson($url.'/actions', ['action' => 'blacklist', 'note' => 'Procurement eligibility restriction.'])->assertOk()->assertJsonPath('data.status', 'blacklisted');
        $this->postJson($url.'/actions', ['action' => 'approve'])->assertConflict();
        $this->seed(PhaseThreeDemoSeeder::class);
        $this->getJson($url)->assertJsonPath('data.status', 'blacklisted')->assertJsonCount(5, 'data.history');
        foreach (['vendor', 'approver', 'evaluator', 'management_viewer'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role]));
            $this->postJson($url.'/actions', ['action' => 'verify'])->assertForbidden();
        }
        $this->getJson('/api/vendors')->assertOk();
        $this->actingAs(User::factory()->create(['role' => 'vendor']));
        $this->getJson($url)->assertForbidden();
    }
}
