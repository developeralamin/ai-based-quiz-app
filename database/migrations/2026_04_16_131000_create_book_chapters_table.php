<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create table for book chapters/sections
     */
    public function up(): void
    {
        Schema::create('book_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->integer('chapter_number');
            $table->string('title');
            $table->longText('content');
            $table->integer('page_start')->nullable();
            $table->integer('page_end')->nullable();
            $table->text('summary')->nullable();
            $table->json('key_topics')->nullable();
            $table->timestamps();

            $table->index(['book_id', 'chapter_number']);
            $table->fullText(['title', 'content', 'summary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_chapters');
    }
};
