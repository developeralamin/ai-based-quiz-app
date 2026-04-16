<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Columns are already added by 2026_04_16_130000_enhance_ai_quizzes_table
        // This migration is a no-op
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op migration, no changes to rollback
    }
};
