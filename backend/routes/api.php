<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\TenderController;
use App\Http\Controllers\Api\VendorController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'BSH E-Procurement API',
    ]);
});

Route::middleware([
    'auth:sanctum',
    'procurement.role:admin,approver,evaluator,management_viewer,vendor',
])->group(function () {
    Route::get('/tenders', [TenderController::class, 'index']);
    Route::get('/tenders/{tender}', [TenderController::class, 'show']);
});

Route::middleware([
    'auth:sanctum',
    'procurement.role:admin,approver,evaluator,management_viewer',
])->group(function () {
    Route::get('/vendors', [VendorController::class, 'index']);
    Route::get('/vendors/{vendor}', [VendorController::class, 'show']);

    Route::get('/requisitions', [RequisitionController::class, 'index']);
    Route::get('/requisitions/{requisition}', [RequisitionController::class, 'show']);

    Route::post('/vendors/{vendor}/actions', [VendorController::class, 'action'])
        ->middleware('procurement.role:admin');

    Route::post('/tenders', [TenderController::class, 'store'])
        ->middleware('procurement.role:admin');

    Route::put('/tenders/{tender}', [TenderController::class, 'update'])
        ->middleware('procurement.role:admin');

    Route::post('/tenders/{tender}/actions', [TenderController::class, 'action'])
        ->middleware('procurement.role:admin,approver');

    Route::post('/requisitions', [RequisitionController::class, 'store'])
        ->middleware('procurement.role:admin');

    Route::put('/requisitions/{requisition}', [RequisitionController::class, 'update'])
        ->middleware('procurement.role:admin');

    Route::post('/requisitions/{requisition}/actions', [RequisitionController::class, 'action'])
        ->middleware('procurement.role:admin,approver');

    Route::post('/requisitions/{requisition}/convert', [RequisitionController::class, 'convert'])
        ->middleware('procurement.role:admin');
});

Route::get('/dashboard/admin', AdminDashboardController::class)
    ->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
