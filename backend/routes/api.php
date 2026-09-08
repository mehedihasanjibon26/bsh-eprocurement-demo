<?php

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

Route::get('/vendors', [VendorController::class, 'index']);
Route::get('/requisitions', [RequisitionController::class, 'index']);
Route::get('/tenders', [TenderController::class, 'index']);
