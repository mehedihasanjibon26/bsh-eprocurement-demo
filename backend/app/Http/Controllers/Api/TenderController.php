<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tender;
use Illuminate\Http\JsonResponse;

class TenderController extends Controller
{
    public function index(): JsonResponse
    {
        $tenders = Tender::query()
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $tenders,
        ]);
    }
}
