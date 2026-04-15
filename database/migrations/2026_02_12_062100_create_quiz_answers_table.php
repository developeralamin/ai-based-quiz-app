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
        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_attempt_id')->references('id')->on('quiz_attempts')->onDelete('cascade')->index();
            $table->integer('question_no');
            $table->string('question_type'); // multiple-choice, true-false, fill-in-gaps, short-answer, long-answer
            $table->longText('question_text');
            $table->longText('user_answer');
            $table->longText('correct_answer');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->index(['quiz_attempt_id', 'question_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
    }
};
