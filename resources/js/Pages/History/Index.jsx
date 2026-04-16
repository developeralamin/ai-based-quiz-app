import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ClockIcon, QuestionMarkCircleIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function HistoryIndex({ auth, activities, stats = {} }) {
  const [filterType, setFilterType] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return activities;
    return activities.filter(activity => activity.type === filterType);
  }, [activities, filterType]);

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

  const handleExport = () => {
    // Prepare CSV data
    const headers = ['ID', 'Type', 'Title', 'Date', 'Score', 'Correct/Total'];
    const csvContent = [
      headers.join(','),
      ...filteredActivities.map(activity =>
        [
          activity.id,
          activity.type,
          `"${activity.title}"`,
          activity.date,
          activity.score || 'N/A',
          activity.correct && activity.total ? `${activity.correct}/${activity.total}` : 'N/A'
        ].join(',')
      )
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (activity) => {
    if (activity.type === 'quiz') {
      // Navigate to the quiz details page using the quiz_id or activity id
      // For now, we'll show a modal with details
      setSelectedActivity(activity);
    }
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
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Filter
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
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
                      <p className="text-2xl font-bold">{stats.totalQuizzes || 0}</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Average Score</p>
                      <p className="text-2xl font-bold">{stats.averageScore || 0}%</p>
                    </div>
                    <AcademicCapIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Notes Created</p>
                      <p className="text-2xl font-bold">{stats.notesCreated || 0}</p>
                    </div>
                    <DocumentTextIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Study Hours</p>
                      <p className="text-2xl font-bold">{stats.studyHours || 0}</p>
                    </div>
                    <ChatBubbleLeftRightIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilter && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Filter Activities</h3>
                    <button onClick={() => setShowFilter(false)} className="text-gray-500 hover:text-gray-700">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Activities</option>
                        <option value="quiz">Quizzes</option>
                        <option value="study">Study Sessions</option>
                        <option value="note">Notes</option>
                        <option value="ai_chat">AI Chat</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activities {filterType !== 'all' && `(${filteredActivities.length})`}
                </h2>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => {
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
                        <button
                          onClick={() => handleViewDetails(activity)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-600">No activities match your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.title}</h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Activity Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{selectedActivity.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedActivity.date}</p>
                </div>
                {selectedActivity.score && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedActivity.score}</p>
                  </div>
                )}
                {selectedActivity.correct && selectedActivity.total && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Correct Answers</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedActivity.correct}/{selectedActivity.total}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {selectedActivity.type === 'quiz' && (
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      router.visit(route('ai-chat.details', selectedActivity.quiz_id));
                    }}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    View Full Results
                  </button>
                )}
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
