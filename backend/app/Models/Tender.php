<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tender extends Model
{
    use HasFactory;

    protected $fillable = [
        'tender_number',
        'title',
        'category',
        'type',
        'closing_date',
        'status',
        'bid_count',
        'requisition_id', 'scope', 'eligibility', 'boq', 'documents',
        'invited_vendor_ids', 'clarifications', 'addenda', 'history',
    ];

    protected function casts(): array
    {
        return [
            'boq' => 'array', 'documents' => 'array', 'invited_vendor_ids' => 'array',
            'clarifications' => 'array', 'addenda' => 'array', 'history' => 'array',
            'closing_date' => 'datetime',
            'bid_count' => 'integer',
        ];
    }
}
