<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenders', function (Blueprint $table) {
            $table->id();
            $table->string('tender_number')->unique();
            $table->string('title');
            $table->string('category');
            $table->string('type');
            $table->dateTime('closing_date')->nullable();
            $table->string('status');
            $table->unsignedInteger('bid_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenders');
    }
};
