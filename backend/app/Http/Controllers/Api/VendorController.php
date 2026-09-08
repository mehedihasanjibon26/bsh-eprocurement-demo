<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;

class VendorController extends Controller
{
    public function index(): JsonResponse
    {
        $vendors = Vendor::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $vendors,
        ]);
    }
}
