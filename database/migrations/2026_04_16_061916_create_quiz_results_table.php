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
        Schema::create('quiz_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('quiz_id')->references('id')->on('a_i_quizzes')->onDelete('cascade');
            $table->json('user_answers'); // Store user's answers
            $table->json('quiz_questions'); // Store the quiz questions along with answers
            $table->decimal('score', 5, 2); // Score as percentage (0-100)
            $table->integer('correct_count'); // Number of correct answers
            $table->integer('total_count'); // Total questions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_results');
    }
};
