<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use Illuminate\Http\JsonResponse;

class RequisitionController extends Controller
{
    public function index(): JsonResponse
    {
        $requisitions = Requisition::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $requisitions,
        ]);
    }
}
