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
    ];

    protected function casts(): array
    {
        return [
            'closing_date' => 'datetime',
            'bid_count' => 'integer',
        ];
    }
}
