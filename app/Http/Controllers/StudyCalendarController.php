<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudyCalendarController extends Controller
{
    /**
     * Display the study calendar page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('StudyCalendar/Index', [
            'events' => [
                ['id' => 1, 'title' => 'Math Study Session', 'date' => '2024-01-20', 'time' => '14:00', 'duration' => '2 hours', 'subject' => 'Mathematics'],
                ['id' => 2, 'title' => 'Physics Lab', 'date' => '2024-01-21', 'time' => '10:00', 'duration' => '3 hours', 'subject' => 'Physics'],
                ['id' => 3, 'title' => 'Chemistry Review', 'date' => '2024-01-22', 'time' => '16:00', 'duration' => '1.5 hours', 'subject' => 'Chemistry'],
                ['id' => 4, 'title' => 'CS Project Work', 'date' => '2024-01-23', 'time' => '09:00', 'duration' => '4 hours', 'subject' => 'Computer Science'],
            ]
        ]);
    }
} 