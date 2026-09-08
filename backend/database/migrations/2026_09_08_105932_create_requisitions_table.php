<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('requisition_number')->unique();
            $table->string('department');
            $table->string('title');
            $table->string('category');
            $table->string('requester');
            $table->decimal('estimated_budget', 15, 2);
            $table->date('required_date');
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requisitions');
    }
};
