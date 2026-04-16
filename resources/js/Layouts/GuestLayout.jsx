import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex justify-center mb-8 hover:opacity-80 transition">
                    <ApplicationLogo className="h-16 w-auto fill-current text-purple-600" />
                </Link>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-purple-200/50 p-8 backdrop-blur-sm border border-purple-100/50">
                    {children}
                </div>

                {/* Footer text */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    © 2024 QuizMaster. Master your learning journey.
                </p>
            </div>
        </div>
    );
}
