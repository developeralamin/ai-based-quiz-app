<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add advanced features to ai_quizzes table
     */
    public function up(): void
    {
        Schema::table('a_i_quizzes', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('a_i_quizzes', 'book_id')) {
                $table->foreignId('book_id')->nullable()->references('id')->on('books')->onDelete('set null')->after('user_id');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'difficulty_level')) {
                $table->enum('difficulty_level', ['easy', 'medium', 'hard'])->default('medium')->after('title');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'topic')) {
                $table->string('topic')->nullable()->after('difficulty_level');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'chapter')) {
                $table->integer('chapter')->nullable()->after('topic');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'quiz_type')) {
                $table->enum('quiz_type', ['practice', 'exam', 'adaptive'])->default('practice')->after('chapter');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'duration_minutes')) {
                $table->integer('duration_minutes')->nullable()->after('quiz_type');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'is_template')) {
                $table->boolean('is_template')->default(false)->after('duration_minutes');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'template_name')) {
                $table->string('template_name')->nullable()->after('is_template');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'shuffle_questions')) {
                $table->boolean('shuffle_questions')->default(true)->after('template_name');
            }
            if (!Schema::hasColumn('a_i_quizzes', 'show_explanations')) {
                $table->boolean('show_explanations')->default(true)->after('shuffle_questions');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('a_i_quizzes', function (Blueprint $table) {
            $table->dropForeignIdFor(Book::class);
            $table->dropColumn([
                'book_id',
                'difficulty_level',
                'topic',
                'chapter',
                'quiz_type',
                'duration_minutes',
                'is_template',
                'template_name',
                'shuffle_questions',
                'show_explanations'
            ]);
        });
    }
};
