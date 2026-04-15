<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Display the history page
     * @return Response
     */
    public function index(): Response
    {
        // Return an empty activities array - data will be fetched via AJAX from the API
        return Inertia::render('History/Index', [
            'activities' => [
                // This is now fetched via AJAX in the component
            ]
        ]);
    }
} 