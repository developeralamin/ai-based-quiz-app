<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create table for storing reusable questions
     */
    public function up(): void
    {
        Schema::create('question_bank', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('chapter_id')->nullable()->constrained('book_chapters')->onDelete('set null');
            $table->enum('question_type', ['multiple-choice', 'true-false', 'short-answer'])->default('multiple-choice');
            $table->string('topic')->nullable();
            $table->enum('difficulty_level', ['easy', 'medium', 'hard'])->default('medium');
            $table->longText('question_text');
            $table->json('options')->nullable(); // For MCQ
            $table->string('correct_answer');
            $table->longText('explanation')->nullable();
            $table->integer('correct_count')->default(0);
            $table->integer('incorrect_count')->default(0);
            $table->float('success_rate')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'book_id']);
            $table->index('difficulty_level');
            $table->fullText(['question_text', 'topic']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_bank');
    }
};
