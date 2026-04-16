<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Track detailed user performance analytics
     */
    public function up(): void
    {
        if (Schema::hasTable('user_performance_analytics')) {
            return;
        }

        Schema::create('user_performance_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('set null');
            $table->string('topic')->nullable();
            $table->enum('difficulty_level', ['easy', 'medium', 'hard'])->nullable();
            $table->integer('total_quizzes')->default(0);
            $table->integer('total_questions')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->decimal('average_score', 5, 2)->default(0);
            $table->decimal('accuracy_percentage', 5, 2)->default(0);
            $table->integer('total_time_minutes')->default(0);
            $table->json('difficulty_distribution')->nullable();
            $table->json('question_type_distribution')->nullable();
            $table->decimal('trend_percentage', 5, 2)->nullable(); // Performance trend
            $table->timestamp('last_quiz_date')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'book_id', 'topic', 'difficulty_level'], 'user_perf_unique');
            $table->index(['user_id', 'book_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_performance_analytics');
    }
};
