import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CalendarDaysIcon, PlusIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function StudyCalendarIndex({ auth, events }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Physics': 'bg-green-100 text-green-700 border-green-200',
      'Chemistry': 'bg-purple-100 text-purple-700 border-purple-200',
      'Computer Science': 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Study Calendar</h2>}
    >
      <Head title="Study Calendar" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Study Calendar</h1>
                  <p className="text-gray-600 mt-1">Plan and organize your study sessions</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  Add Event
                </button>
              </div>

              {/* Calendar Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Today's Events */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CalendarDaysIcon className="h-8 w-8" />
                      <h2 className="text-xl font-semibold">Today's Schedule</h2>
                    </div>
                    <div className="space-y-3">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="bg-white bg-opacity-20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm opacity-90">{event.subject}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatTime(event.time)}</p>
                              <p className="text-sm opacity-90">{event.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">Total Study Hours</p>
                        <p className="text-2xl font-bold text-blue-900">24</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AcademicCapIcon className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Sessions This Week</p>
                        <p className="text-2xl font-bold text-green-900">8</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubjectColor(event.subject)}`}>
                          {event.subject}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {formatTime(event.time)}
                        </span>
                        <span>{event.duration}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors">
                          Join
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Pomodoro Technique</h3>
                    <p className="text-sm text-gray-600">Study for 25 minutes, then take a 5-minute break to maintain focus.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Active Recall</h3>
                    <p className="text-sm text-gray-600">Test yourself regularly instead of just re-reading material.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Spaced Repetition</h3>
                    <p className="text-sm text-gray-600">Review material at increasing intervals to improve retention.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 