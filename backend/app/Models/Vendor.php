<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'status',
        'performance_score',
        'document_expiry_alert',
    ];

    protected function casts(): array
    {
        return [
            'performance_score' => 'decimal:1',
        ];
    }
}
