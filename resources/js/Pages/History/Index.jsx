import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ClockIcon, QuestionMarkCircleIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function HistoryIndex({ auth, activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz':
        return QuestionMarkCircleIcon;
      case 'study':
        return AcademicCapIcon;
      case 'note':
        return DocumentTextIcon;
      case 'ai_chat':
        return ChatBubbleLeftRightIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quiz':
        return 'bg-green-100 text-green-700';
      case 'study':
        return 'bg-blue-100 text-blue-700';
      case 'note':
        return 'bg-purple-100 text-purple-700';
      case 'ai_chat':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">History</h2>}
    >
      <Head title="History" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
                  <p className="text-gray-600 mt-1">Track your learning journey and progress</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Filter
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Export
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Quizzes</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Study Hours</p>
                      <p className="text-2xl font-bold">48</p>
                    </div>
                    <AcademicCapIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Notes Created</p>
                      <p className="text-2xl font-bold">25</p>
                    </div>
                    <DocumentTextIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">AI Chats</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <ChatBubbleLeftRightIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
                {activities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{formatDate(activity.date)}</span>
                          {activity.score && <span>Score: {activity.score}</span>}
                          {activity.duration && <span>Duration: {activity.duration}</span>}
                          {activity.pages && <span>Pages: {activity.pages}</span>}
                          {activity.messages && <span>Messages: {activity.messages}</span>}
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {activities.length === 0 && (
                <div className="text-center py-12">
                  <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                  <p className="text-gray-600 mb-4">Start using the platform to see your activity history</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                    Start Learning
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 