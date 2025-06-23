import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout>
            <Head title="Generate Quiz" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {error && (
                        // <Alert variant="destructive" className="mb-4">
                            <div>{error}</div>
                        // </Alert>
                    )}

                    <div className="p-6">
                        {showResults && (
                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-bold">Your Score: {score.toFixed(2)}%</h3>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold mb-4">Quiz</h2>
                        {quizQuestions.map((question) => (
                            <div key={question.question_no} className="mb-6 p-4 border rounded">
                                <p className="font-semibold">
                                    {question.question_no}. {question.question}
                                </p>
                                {question.type === "multiple-choice" && (
                                <ul>
                                    {question.options.map((option, idx) => (
                                        <li key={idx} className="mt-2">
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, option)}
                                                className={`px-4 py-2 rounded border ${
                                                    userAnswers[question.question_no] === String.fromCharCode(65 + question.options.indexOf(option))
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100'
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
                                    <ul>
                                        <li className="mt-2">
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "True")}
                                                className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "True" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                True
                                            </button>
                                        </li>
                                        <li className="mt-2">
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "False")}
                                                className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "False" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
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
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}
                                {question.type === "short-answer" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}
                                {question.type === "long-answer" && (
                                    <textarea
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}

                            {showResults && (
                                <div className="mt-2">
                                    <p
                                        className={`font-bold ${
                                            userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        Your Answer:
                                        {userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase()
                                            ? ' Correct'
                                            : ' Incorrect'}
                                    </p>
                                    {userAnswers[question.question_no]?.trim().toLowerCase() !== question.answer?.trim().toLowerCase() && (
                                        <p className="text-green-600 font-bold">
                                            Correct Answer: {question.answer}
                                        </p>
                                    )}
                                </div>
                            )}
                            </div>
                        ))}

                        <button onClick={handleShowResults} className="mt-4" disabled={isQuizCompleted}>
                            Show Score
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}