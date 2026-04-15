import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Left side - Branding and Features */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-700">N</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">NextGenEdu</h1>
                            <p className="text-purple-200 text-sm">Modern Learning Platform</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 mb-12">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-400 bg-opacity-20">
                                <svg className="h-6 w-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Quizzes</h3>
                            <p className="text-purple-200">Generate intelligent quizzes from your notes with AI assistance</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-400 bg-opacity-20">
                                <svg className="h-6 w-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Smart Learning</h3>
                            <p className="text-purple-200">Track your progress and get personalized recommendations</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-400 bg-opacity-20">
                                <svg className="h-6 w-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Grow Your Skills</h3>
                            <p className="text-purple-200">Improve your knowledge with interactive assessment tools</p>
                        </div>
                    </div>
                </div>

                <div className="text-purple-200 text-sm">
                    <p>© 2024 NextGenEdu. All rights reserved.</p>
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-700">N</span>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        {children}
                    </div>

                    {/* Footer Text - Mobile */}
                    <p className="mt-6 text-center text-sm text-purple-200 lg:hidden">
                        © 2024 NextGenEdu
                    </p>
                </div>
            </div>
        </div>
    );
}
