import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChatBubbleLeftRightIcon, PlusIcon, PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/outline';

export default function AiChatIndex({ auth, conversations }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">AI Chat</h2>}
    >
      <Head title="AI Chat" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-[600px]">
            <div className="flex h-full">
              {/* Sidebar - Conversations List */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-purple-50 border-purple-200' : ''
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{conversation.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{conversation.last_message}</p>
                      <span className="text-xs text-gray-500">{formatDate(conversation.updated_at)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.title}</h2>
                      <p className="text-sm text-gray-600">Last updated: {formatDate(selectedConversation.updated_at)}</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Sample messages */}
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-600 p-2 rounded-full">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-gray-900">Hello! I'm your AI study assistant. How can I help you today?</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-gray-900">Can you explain calculus concepts?</p>
                        </div>
                        <div className="bg-gray-600 p-2 rounded-full">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-purple-600 p-2 rounded-full">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-gray-900">Of course! Calculus is a branch of mathematics that deals with continuous change. It has two main branches: differential calculus and integral calculus. Would you like me to explain a specific concept?</p>
                        </div>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Welcome Screen */
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to AI Chat</h3>
                      <p className="text-gray-600 mb-4">Select a conversation or start a new one to begin chatting with your AI study assistant</p>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
                        <PlusIcon className="h-5 w-5" />
                        Start New Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 