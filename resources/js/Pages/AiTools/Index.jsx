import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { SparklesIcon, QuestionMarkCircleIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function AiToolsIndex({ auth, tools }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'quiz':
        return QuestionMarkCircleIcon;
      case 'assistant':
        return SparklesIcon;
      case 'summarize':
        return DocumentTextIcon;
      case 'flashcard':
        return AcademicCapIcon;
      default:
        return SparklesIcon;
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">AI Tools</h2>}
    >
      <Head title="AI Tools" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="text-center mb-8">
                <SparklesIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Learning Tools</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Enhance your learning experience with our intelligent tools designed to make studying more effective and engaging.
                </p>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {tools.map((tool) => {
                  const IconComponent = getIcon(tool.icon);
                  return (
                    <div key={tool.id} className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-600 p-3 rounded-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
                          <p className="text-gray-600 mb-4">{tool.description}</p>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Try Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Features */}
              <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Voice Notes</h3>
                    <p className="text-sm text-gray-600">Convert speech to text for easy note-taking</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Study Analytics</h3>
                    <p className="text-sm text-gray-600">Track your learning progress and performance</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
                    <p className="text-sm text-gray-600">AI-powered study schedule optimization</p>
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