import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { QuestionMarkCircleIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function QuestionBankIndex({ auth, questions }) {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'hard': 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type) => {
    const colors = {
      'multiple_choice': 'bg-blue-100 text-blue-700',
      'short_answer': 'bg-purple-100 text-purple-700',
      'true_false': 'bg-orange-100 text-orange-700',
      'long_answer': 'bg-indigo-100 text-indigo-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const formatQuestionType = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Question Bank</h2>}
    >
      <Head title="Question Bank" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
                  <p className="text-gray-600 mt-1">Access a comprehensive collection of study questions</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  Add Question
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">All Subjects</option>
                  <option value="Geography">Geography</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Biology">Biology</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="true_false">True/False</option>
                  <option value="long_answer">Long Answer</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Questions</p>
                      <p className="text-2xl font-bold">{questions.length}</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Easy Questions</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Medium Questions</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Hard Questions</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <QuestionMarkCircleIcon className="h-8 w-8 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                          {formatQuestionType(question.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {question.subject}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">{question.question}</h3>
                    <div className="flex gap-2">
                      <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors">
                        View Answer
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                        Add to Quiz
                      </button>
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors">
                        Practice
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {questions.length === 0 && (
                <div className="text-center py-12">
                  <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-4">Start building your question bank by adding questions</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
                    <PlusIcon className="h-5 w-5" />
                    Add Your First Question
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Import Questions</div>
                    <div className="text-sm text-gray-600">Upload questions from files</div>
                  </button>
                  <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Generate Quiz</div>
                    <div className="text-sm text-gray-600">Create quiz from questions</div>
                  </button>
                  <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900">Share Questions</div>
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