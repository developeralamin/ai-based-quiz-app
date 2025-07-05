<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'notifications' => true,
                'email_alerts' => false,
                'dark_mode' => false,
                'auto_save' => true,
                'study_reminders' => true,
            ]
        ]);
    }
} 