<?php

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

Route::get('/vendors', [VendorController::class, 'index']);
Route::get('/requisitions', [RequisitionController::class, 'index']);
Route::get('/tenders', [TenderController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
