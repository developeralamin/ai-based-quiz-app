<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Book;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (or create a test user)
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create sample books
        $sampleBooks = [
            [
                'title' => 'Introduction to Computer Science',
                'author' => 'John Doe',
                'description' => 'A comprehensive guide to the fundamentals of computer science, covering algorithms, data structures, and programming principles.',
            ],
            [
                'title' => 'Advanced Mathematics for Engineers',
                'author' => 'Jane Smith',
                'description' => 'Explore advanced mathematical concepts including calculus, linear algebra, and differential equations essential for engineering.',
            ],
            [
                'title' => 'Physics Fundamentals',
                'author' => 'Bob Johnson',
                'description' => 'Master the core concepts of physics including mechanics, thermodynamics, electricity, and magnetism.',
            ],
            [
                'title' => 'Web Development Masterclass',
                'author' => 'Sarah Williams',
                'description' => 'Learn modern web development with HTML, CSS, JavaScript, and popular frameworks for building responsive applications.',
            ],
            [
                'title' => 'Data Science Handbook',
                'author' => 'Mike Davis',
                'description' => 'Comprehensive guide to data science, machine learning, statistics, and practical applications in real-world scenarios.',
            ],
        ];

        foreach ($sampleBooks as $book) {
            Book::create([
                'user_id' => $user->id,
                'title' => $book['title'],
                'author' => $book['author'],
                'description' => $book['description'],
                'file_path' => 'books/pdfs/sample.pdf', // Placeholder - actual PDF upload would be needed
                'cover_image' => null, // Can be set to a default cover path
            ]);
        }
    }
}
