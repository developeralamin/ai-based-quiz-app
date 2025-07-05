import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Generate() {
    const { props } = usePage();
    const quizQuestions = props.quiz ?? [];
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(props.error || '');
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);


    const handleAnswerSelect = (questionId, option) => {
        if (!isQuizCompleted) {
            const question = quizQuestions.find(q => q.question_no === questionId);
            if (question) {
                if(question.type === "multiple-choice"){
                    if (question.options) {
                        const optionIndex = question.options.indexOf(option);
                        const optionLetter = String.fromCharCode(65 + optionIndex); // A=65, B=66, etc.
                        setUserAnswers({ ...userAnswers, [questionId]: optionLetter });
                    }
                } else if (question.type === "true-false"){
                    setUserAnswers({ ...userAnswers, [questionId]: option });
                }
            }
        }
    };

    const handleTextAnswerChange = (questionId, answer) => {
        if (!isQuizCompleted) {
            setUserAnswers({ ...userAnswers, [questionId]: answer });
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        quizQuestions.forEach((q) => {
            if (q.type === "multiple-choice" || q.type === "true-false") {
                const userAnswer = userAnswers[q.question_no]?.trim().toLowerCase();
                const correctAnswer = q.answer?.trim().toLowerCase();
                if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            } else {
                const userAnswer = userAnswers[q.question_no]?.trim().toLowerCase();
                const correctAnswer = q.answer?.trim().toLowerCase();
                if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            }
        });
        const calculatedScore = (correctCount / quizQuestions.length) * 100;
        setScore(calculatedScore);
        return calculatedScore;
    };

    const handleShowResults = () => {
        calculateScore();
        setShowResults(true);
        setIsQuizCompleted(true);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100); 
    };

    return (
        <DashboardLayout>
            <Head title="Quiz Results" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {showResults && (
                            <div className="text-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                <h3 className="text-3xl font-bold text-purple-800">Your Score: {score.toFixed(2)}%</h3>
                                <p className="text-purple-600 mt-2">
                                    {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                                </p>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz Questions</h2>
                        {quizQuestions.map((question) => (
                            <div key={question.question_no} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="font-semibold text-lg mb-4 text-gray-800">
                                    {question.question_no}. {question.question}
                                </p>
                                {question.type === "multiple-choice" && (
                                <ul className="space-y-2">
                                    {question.options.map((option, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, option)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                                                    userAnswers[question.question_no] === String.fromCharCode(65 + question.options.indexOf(option))
                                                        ? 'bg-purple-600 text-white border-purple-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                                                } ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                {option}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                                {question.type === "true-false" && (
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "True")}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${userAnswers[question.question_no] === "True" ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                True
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "False")}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${userAnswers[question.question_no] === "False" ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                False
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                {question.type === "fill-in-gaps" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your answer..."
                                    />
                                )}
                                {question.type === "short-answer" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your answer..."
                                    />
                                )}
                                {question.type === "long-answer" && (
                                    <textarea
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-3 border border-gray-300 rounded-lg w-full h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                        placeholder="Enter your detailed answer..."
                                    />
                                )}

                            {showResults && (
                                <div className="mt-4 p-4 rounded-lg">
                                    <p
                                        className={`font-bold text-lg ${
                                            userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                            ? '✓ Correct'
                                            : '✗ Incorrect'}
                                    </p>
                                    {userAnswers[question.question_no]?.trim().toLowerCase() !== question.answer?.trim().toLowerCase() && (
                                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-green-800 font-semibold">Correct Answer:</p>
                                            <p className="text-green-700">{question.answer}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>
                        ))}

                        {!isQuizCompleted && (
                            <div className="text-center mt-8">
                                <button 
                                    onClick={handleShowResults} 
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-lg"
                                >
                                    Submit Quiz & Show Results
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}