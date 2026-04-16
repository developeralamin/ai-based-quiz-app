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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('author');
            $table->text('description')->nullable();
            $table->string('file_path'); // Path to PDF file in storage
            $table->string('cover_image')->nullable(); // Path to cover image in storage
            $table->timestamps();

            // Add index for faster queries
            $table->index('user_id');
            $table->fullText(['title', 'author', 'description']); // For search functionality
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
