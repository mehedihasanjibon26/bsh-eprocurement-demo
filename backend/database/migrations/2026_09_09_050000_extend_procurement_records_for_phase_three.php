<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requisitions', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->json('items')->nullable();
            $table->json('history')->nullable();
        });
        Schema::table('vendors', function (Blueprint $table) {
            $table->json('profile')->nullable();
            $table->json('history')->nullable();
        });
        Schema::table('tenders', function (Blueprint $table) {
            $table->foreignId('requisition_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->text('scope')->nullable();
            $table->text('eligibility')->nullable();
            $table->json('boq')->nullable();
            $table->json('documents')->nullable();
            $table->json('invited_vendor_ids')->nullable();
            $table->json('clarifications')->nullable();
            $table->json('addenda')->nullable();
            $table->json('history')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tenders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('requisition_id');
            $table->dropColumn(['scope', 'eligibility', 'boq', 'documents', 'invited_vendor_ids', 'clarifications', 'addenda', 'history']);
        });
        Schema::table('vendors', fn (Blueprint $table) => $table->dropColumn(['profile', 'history']));
        Schema::table('requisitions', fn (Blueprint $table) => $table->dropColumn(['description', 'items', 'history']));
    }
};
