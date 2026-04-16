<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add advanced features to quiz_results table
     */
    public function up(): void
    {
        Schema::table('quiz_results', function (Blueprint $table) {
            if (!Schema::hasColumn('quiz_results', 'difficulty_attempted')) {
                $table->enum('difficulty_attempted', ['easy', 'medium', 'hard'])->nullable()->after('total_count');
            }
            if (!Schema::hasColumn('quiz_results', 'time_taken_seconds')) {
                $table->integer('time_taken_seconds')->nullable()->after('difficulty_attempted');
            }
            if (!Schema::hasColumn('quiz_results', 'is_completed')) {
                $table->boolean('is_completed')->default(true)->after('time_taken_seconds');
            }
            if (!Schema::hasColumn('quiz_results', 'started_at')) {
                $table->timestamp('started_at')->nullable()->after('is_completed');
            }
            if (!Schema::hasColumn('quiz_results', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('started_at');
            }
            if (!Schema::hasColumn('quiz_results', 'topic')) {
                $table->string('topic')->nullable()->after('completed_at');
            }
            if (!Schema::hasColumn('quiz_results', 'chapter')) {
                $table->integer('chapter')->nullable()->after('topic');
            }
            if (!Schema::hasColumn('quiz_results', 'question_wise_analysis')) {
                $table->json('question_wise_analysis')->nullable()->after('chapter');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_results', function (Blueprint $table) {
            $table->dropColumn([
                'difficulty_attempted',
                'time_taken_seconds',
                'is_completed',
                'started_at',
                'completed_at',
                'topic',
                'chapter',
                'question_wise_analysis'
            ]);
        });
    }
};
