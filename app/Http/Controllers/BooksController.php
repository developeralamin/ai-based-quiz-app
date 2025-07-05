<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BooksController extends Controller
{
    /**
     * Display the books page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Books/Index', [
            'books' => [
                // Sample data - replace with actual database queries
                ['id' => 1, 'title' => 'Introduction to Computer Science', 'author' => 'John Doe', 'cover' => '/images/book1.jpg'],
                ['id' => 2, 'title' => 'Advanced Mathematics', 'author' => 'Jane Smith', 'cover' => '/images/book2.jpg'],
                ['id' => 3, 'title' => 'Physics Fundamentals', 'author' => 'Bob Johnson', 'cover' => '/images/book3.jpg'],
            ]
        ]);
    }
} 