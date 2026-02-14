import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Link href={route('ai-chat.details', conversation.id)} key={conversation.id}>
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{conversation.title.slice(0,20)}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3"> 
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-red-500">⏰</span>
                      <span className="text-sm">{formatDate(conversation.created_at)}</span>
                    </div>
                  </div>
                </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No quizzes taken yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
}
