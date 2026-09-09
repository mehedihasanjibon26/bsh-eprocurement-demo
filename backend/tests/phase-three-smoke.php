<?php

// Run: php tests/phase-three-smoke.php
// Uses the configured database; every write (including the test token) is rolled back.
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

DB::beginTransaction();
try {
    $user = User::where('email', 'admin@bsh-demo.com')->firstOrFail();
    $token = $user->createToken('phase-three-transactional-verification')->plainTextToken;
    $checks = 0;
    $call = function (string $method, string $url, array $data = [], int $expected = 200) use ($app, $kernel, $token, &$checks): array {
        $app['auth']->forgetGuards();
        $request = Request::create('/api'.$url, $method, [], [], [], ['HTTP_ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer '.$token], json_encode($data));
        $response = $kernel->handle($request);
        $result = json_decode($response->getContent(), true);
        if ($response->getStatusCode() !== $expected) {
            throw new RuntimeException($method.' '.$url.' returned '.$response->getStatusCode().': '.($result['message'] ?? 'Unexpected response'));
        }
        $checks++;
        return $result['data'] ?? [];
    };
    $items = [['name' => 'ICU patient monitor', 'specification' => 'ECG, SpO2, NIBP and temperature monitoring.', 'quantity' => 2, 'unit' => 'unit', 'unit_cost' => 500000]];
    $request = $call('POST', '/requisitions', ['title' => 'Transactional ICU verification', 'department' => 'ICU', 'category' => 'medical_equipment', 'description' => 'Patient monitoring equipment for hospital care.', 'required_date' => now()->addDays(30)->toDateString(), 'estimated_budget' => 1000000, 'items' => $items], 201);
    $url = '/requisitions/'.$request['id'];
    $call('POST', $url.'/actions', ['action' => 'submit']);
    $call('POST', $url.'/actions', ['action' => 'approve']);
    $tender = $call('POST', $url.'/convert', ['title' => 'Transactional ICU supply verification', 'type' => 'public_tender', 'closing_date' => now()->addDays(14)->toIso8601String()], 201);
    $call('GET', $url);
    $form = ['title' => $tender['title'], 'category' => 'medical_equipment', 'type' => 'public_tender', 'scope' => 'Supply, installation and training.', 'eligibility' => 'Valid trade license and manufacturer authorization.', 'closing_date' => now()->addDays(14)->toIso8601String(), 'boq' => $items, 'documents' => ['Technical specifications'], 'invited_vendor_ids' => [], 'requisition_id' => $request['id']];
    $call('PUT', '/tenders/'.$tender['id'], $form);
    foreach (['submit', 'approve', 'publish'] as $action) {
        $call('POST', '/tenders/'.$tender['id'].'/actions', ['action' => $action]);
    }
    $call('GET', '/tenders/'.$tender['id']);
    $form['requisition_id'] = null;
    $form['title'] = 'Transactional independent tender verification';
    $independent = $call('POST', '/tenders', $form, 201);
    foreach (['submit', 'approve', 'publish'] as $action) {
        $call('POST', '/tenders/'.$independent['id'].'/actions', ['action' => $action]);
    }
    $vendor = App\Models\Vendor::where('status', 'approved')->firstOrFail();
    $call('POST', '/vendors/'.$vendor->id.'/actions', ['action' => 'suspend', 'note' => 'Transactional lifecycle verification.']);
    $call('POST', '/vendors/'.$vendor->id.'/actions', ['action' => 'approve']);
    $call('GET', '/vendors/'.$vendor->id);
    $call('GET', '/dashboard/admin');
    echo json_encode(['result' => 'passed', 'database' => DB::connection()->getDriverName(), 'api_checks' => $checks, 'writes' => 'rolled back']).PHP_EOL;
} finally {
    DB::rollBack();
}
