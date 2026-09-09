<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

abstract class ProcurementController extends Controller
{
    protected function categoryRule(): array
    {
        return ['required', Rule::in(['medical_equipment', 'pharmaceuticals', 'medical_consumables', 'diagnostic_reagents', 'laboratory_supplies', 'it_technology', 'facility_maintenance', 'general_supplies', 'professional_services'])];
    }

    protected function itemRules(string $field): array
    {
        return [
            $field => ['required', 'array', 'min:1', 'max:50'],
            "$field.*" => ['array:name,specification,quantity,unit,unit_cost'],
            "$field.*.name" => ['required', 'string', 'max:200'],
            "$field.*.specification" => ['required', 'string', 'max:2000'],
            "$field.*.quantity" => ['required', 'numeric', 'min:0.01', 'max:100000', 'decimal:0,2'],
            "$field.*.unit" => ['required', 'string', 'max:30'],
            "$field.*.unit_cost" => ['required', 'numeric', 'min:0', 'max:100000000', 'decimal:0,2'],
        ];
    }

    protected function recordAction(Model $record, Request $request, string $action, ?string $note = null): void
    {
        $history = $record->history ?? [];
        $history[] = ['action' => $action, 'status' => $record->status, 'actor' => $request->user()->name, 'at' => now()->toIso8601String(), 'note' => $note];
        $record->history = $history;
        $record->save();
    }
}
