import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function WelcomeEducation({ auth, laravelVersion, phpVersion }) {
    const [query, setQuery] = useState('');

    const sampleCourses = [
        {
            id: 1,
            title: 'Foundations of AI in Education',
            description:
                'Understand AI concepts and how to apply them to personalize learning experiences.',
            level: 'Beginner',
        },
        {
            id: 2,
            title: 'Designing Effective Quizzes',
            description:
                'Create assessments that measure learning outcomes and provide actionable feedback.',
            level: 'Intermediate',
        },
        {
            id: 3,
            title: 'Adaptive Learning Systems',
            description:
                'Build systems that adapt content to each learner’s strengths and gaps.',
            level: 'Advanced',
        },
    ];

    const features = [
        {
            title: 'Personalized Paths',
            text: 'Adaptive lessons and quizzes that adjust to each student’s progress and competence.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" stroke="#FF2D20" d="M12 6v6l4 2" />
                </svg>
            ),
        },
        {
            title: 'AI Tutor',
            text: 'Instant explanations, hints, and feedback powered by AI to guide learning.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" stroke="#FF2D20" d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
            ),
        },
        {
            title: 'Practice & Assess',
            text: 'Auto-generated quizzes and instant scoring to track progress over time.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" stroke="#FF2D20" d="M9 12l2 2 4-4" />
                </svg>
            ),
        },
    ];

    const filtered = sampleCourses.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <Head title="EduAI - Welcome" />

            <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-black dark:via-slate-900 dark:to-black">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <header className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#FF2D20]/10 flex items-center justify-center">
                                <span className="text-[#FF2D20] font-bold">AI</span>
                            </div>
                            <h1 className="text-xl font-semibold text-black dark:text-white">EduAI</h1>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="rounded-md px-3 py-2 text-sm text-black hover:text-black/70 dark:text-white">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="rounded-md px-3 py-2 text-sm text-black hover:text-black/70 dark:text-white">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="rounded-md px-3 py-2 text-sm bg-[#FF2D20] text-white rounded-lg">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mt-12 grid gap-12 md:grid-cols-2">
                        <section className="flex flex-col justify-center gap-6">
                            <h2 className="text-4xl font-bold leading-tight text-black dark:text-white">Learn smarter with AI-powered lessons</h2>
                            <p className="text-lg text-black/70 dark:text-white/70">Personalized learning paths, instant feedback, and practice quizzes to help learners master concepts faster.</p>

                            <div className="flex items-center gap-4">
                                <Link href={route('register')} className="inline-flex items-center gap-2 rounded-md bg-[#FF2D20] px-5 py-3 text-white shadow hover:brightness-95">
                                    Start Learning
                                </Link>
                                <a href="#courses" className="text-sm font-medium text-black/70 dark:text-white/70">Explore courses →</a>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg border border-black/5 dark:border-white/5 dark:bg-zinc-800 text-black dark:text-white">
                                    <div className="rounded-full bg-[#FF2D20]/10 p-2">🎯</div>
                                    <div>
                                        <div className="text-sm font-semibold text-black dark:text-white">Proven results</div>
                                        <div className="text-xs text-black/60 dark:text-white/60">Better retention through active practice</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg border border-black/5 dark:border-white/5 dark:bg-zinc-800 text-black dark:text-white">
                                    <div className="rounded-full bg-[#FF2D20]/10 p-2">🔒</div>
                                    <div>
                                        <div className="text-sm font-semibold text-black dark:text-white">Secure & private</div>
                                        <div className="text-xs text-black/60 dark:text-white/60">Learner data stays private</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="rounded-lg bg-white p-6 shadow-lg border border-black/5 dark:border-white/5 dark:bg-zinc-800 text-black dark:text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-black/70 dark:text-white/70">Featured course</div>
                                    <div className="mt-2 text-lg font-semibold text-black dark:text-white">Foundations of AI in Education</div>
                                </div>
                                <div className="text-xs text-black/50 dark:text-white/50">4 modules</div>
                            </div>

                            <div className="mt-4 h-40 w-full rounded-md bg-gradient-to-tr from-[#FFEDD5] to-[#FFF7ED] flex items-center justify-center text-[#7A2D0C]"> 
                                <div className="text-center">
                                    <div className="font-semibold">Interactive</div>
                                    <div className="text-sm">Hands-on labs & quizzes</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-black/70 dark:text-white/70">Instructor: Dr. Gomez</div>
                                <Link href="#" className="text-sm text-[#FF2D20]">View →</Link>
                            </div>
                        </aside>
                    </main>

                    <section id="features" className="mt-12">
                        <h3 className="text-2xl font-semibold text-black dark:text-white">Platform features</h3>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {features.map((f) => (
                                <div key={f.title} className="rounded-lg bg-white p-4 shadow-lg flex items-start gap-4 dark:bg-zinc-800 text-black dark:text-white">
                                    <div className="rounded-md bg-[#FF2D20]/10 p-2">{f.icon}</div>
                                    <div>
                                        <div className="font-semibold text-black dark:text-white">{f.title}</div>
                                        <div className="text-sm text-black/60 dark:text-white/60">{f.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="courses" className="mt-12">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-black dark:text-white">Courses</h3>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="rounded-md border px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((c) => (
                                <div key={c.id} className="rounded-lg bg-white p-4 shadow-lg hover:shadow-xl transition dark:bg-zinc-800 text-black dark:text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-black dark:text-white">{c.title}</div>
                                        <div className="text-xs text-black/50 dark:text-white/50">{c.level}</div>
                                    </div>
                                    <p className="mt-3 text-sm text-black/60 dark:text-white/60">{c.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-xs text-black/50 dark:text-white/50">6 lessons</div>
                                        <Link href="#" className="text-sm text-[#FF2D20]">Start →</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-12">
                        <h3 className="text-2xl font-semibold text-black dark:text-white">What learners say</h3>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-800 text-black dark:text-white">
                                <div className="text-sm text-black/70 dark:text-white/70">"The AI tutor helped me finally understand difficult topics."</div>
                                <div className="mt-3 text-xs text-black/50 dark:text-white/50">— Maria, Educator</div>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-800 text-black dark:text-white">
                                <div className="text-sm text-black/70 dark:text-white/70">"Adaptive quizzes targeted my weak spots and boosted my scores."</div>
                                <div className="mt-3 text-xs text-black/50 dark:text-white/50">— Jamal, Student</div>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-800 text-black dark:text-white">
                                <div className="text-sm text-black/70 dark:text-white/70">"Great content and immediate feedback — a game changer."</div>
                                <div className="mt-3 text-xs text-black/50 dark:text-white/50">— Priya, Curriculum Designer</div>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-16 border-t pt-6 text-sm text-black/60 dark:text-white/60">
                        <div className="flex items-center justify-between">
                          
                            <div>© {new Date().getFullYear()} EduAI</div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
