<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Track adaptive quiz sessions for difficulty adjustment
     */
    public function up(): void
    {
        if (Schema::hasTable('adaptive_quiz_sessions')) {
            return;
        }

        Schema::create('adaptive_quiz_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained('a_i_quizzes')->onDelete('cascade');
            $table->enum('current_difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->integer('current_question_index')->default(0);
            $table->integer('consecutive_correct')->default(0);
            $table->integer('consecutive_incorrect')->default(0);
            $table->boolean('increase_difficulty')->default(false);
            $table->boolean('decrease_difficulty')->default(false);
            $table->json('performance_trend')->nullable();
            $table->json('difficulty_history')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adaptive_quiz_sessions');
    }
};
