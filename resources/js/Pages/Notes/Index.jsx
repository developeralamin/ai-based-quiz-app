import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DocumentTextIcon, PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NotesIndex({ auth, notes }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-700',
      'Physics': 'bg-green-100 text-green-700',
      'Chemistry': 'bg-purple-100 text-purple-700',
      'CS': 'bg-orange-100 text-orange-700',
      'Biology': 'bg-red-100 text-red-700',
      'History': 'bg-yellow-100 text-yellow-700',
    };
    return colors[subject] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notes</h2>}
    >
      <Head title="Notes" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                  <p className="text-gray-600 mt-1">Organize and manage your study notes</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  New Note
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">All Subjects</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="CS">Computer Science</option>
                </select>
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(note.subject)}`}>
                          {note.subject}
                        </span>
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Created: {formatDate(note.created_at)}</span>
                        <span>Updated: {formatDate(note.updated_at)}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors">
                          View
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {notes.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                  <p className="text-gray-600 mb-4">Start creating your first note to organize your studies</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
                    <PlusIcon className="h-5 w-5" />
                    Create Your First Note
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Import Notes</div>
                    <div className="text-sm text-gray-600">Upload existing notes</div>
                  </button>
                  <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Export Notes</div>
                    <div className="text-sm text-gray-600">Download your notes</div>
                  </button>
                  <button className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Share Notes</div>
                    <div className="text-sm text-gray-600">Collaborate with others</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 