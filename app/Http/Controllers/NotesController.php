<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotesController extends Controller
{
    /**
     * Display the notes page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Notes/Index', [
            'notes' => [
                ['id' => 1, 'title' => 'Mathematics Notes', 'subject' => 'Math', 'created_at' => '2024-01-15', 'updated_at' => '2024-01-15'],
                ['id' => 2, 'title' => 'Physics Formulas', 'subject' => 'Physics', 'created_at' => '2024-01-14', 'updated_at' => '2024-01-14'],
                ['id' => 3, 'title' => 'Chemistry Lab Notes', 'subject' => 'Chemistry', 'created_at' => '2024-01-13', 'updated_at' => '2024-01-13'],
                ['id' => 4, 'title' => 'Computer Science Concepts', 'subject' => 'CS', 'created_at' => '2024-01-12', 'updated_at' => '2024-01-12'],
            ]
        ]);
    }
} 