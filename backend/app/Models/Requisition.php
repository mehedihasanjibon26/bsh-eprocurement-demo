<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisition extends Model
{
    use HasFactory;

    protected $fillable = [
        'requisition_number',
        'department',
        'title',
        'category',
        'requester',
        'estimated_budget',
        'required_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'estimated_budget' => 'decimal:2',
            'required_date' => 'date',
        ];
    }
}
