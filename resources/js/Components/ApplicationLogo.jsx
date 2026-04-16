import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-12 h-12">
                {/* Main circle with gradient */}
                <svg
                    viewBox="0 0 48 48"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                >
                    {/* Background circle */}
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>

                    {/* Circle background */}
                    <circle cx="24" cy="24" r="23" fill="url(#logoGradient)" />

                    {/* Brain/Lightbulb icon representing AI and learning */}
                    <g fill="white" opacity="0.95">
                        {/* Brain/bulb top */}
                        <path d="M24 8 C18 8, 14 12, 14 18 C14 22, 17 25, 20 27 L20 35 L28 35 L28 27 C31 25, 34 22, 34 18 C34 12, 30 8, 24 8" />

                        {/* Light rays */}
                        <circle cx="15" cy="14" r="1.5" fill="white" opacity="0.8" />
                        <circle cx="33" cy="14" r="1.5" fill="white" opacity="0.8" />
                        <circle cx="12" cy="22" r="1.5" fill="white" opacity="0.8" />
                        <circle cx="36" cy="22" r="1.5" fill="white" opacity="0.8" />

                        {/* Check mark at bottom - representing quiz completion */}
                        <path d="M16 38 L20 42 L28 32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                    </g>
                </svg>
            </div>
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                QuizMaster
            </span>
        </div>
    );
}
