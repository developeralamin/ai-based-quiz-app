import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const optionLabel = (idx) => String.fromCharCode(65 + idx); // A, B, C...

function normalize(v) {
    if (v === null || v === undefined) return '';
    return String(v).trim().toLowerCase();
}

/* ----------------------------------------
   Check if response is correct
-----------------------------------------*/
function isResponseCorrect(resp) {
    if (!resp) return false;

    const user =
        resp.user_answer ??
        resp.userAnswer ??
        resp.answer ??
        resp.selected;

    const correct =
        resp.correct_answer ??
        resp.correct ??
        resp.answer_key ??
        resp.key ??
        resp.answer;

    if (user !== undefined && correct !== undefined) {
        return normalize(user) === normalize(correct);
    }

    return false;
}

/* ----------------------------------------
   Safe JSON parser
-----------------------------------------*/
function tryParseJSON(text) {
    if (!text || typeof text !== 'string') return null;

    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
            try {
                return JSON.parse(text.slice(start, end + 1));
            } catch {
                return null;
            }
        }
        return null;
    }
}

/* ----------------------------------------
   Extract Gemini quiz array
-----------------------------------------*/
function extractResponses(conversation) {
    if (!conversation) return [];

    const candidates =
        conversation.full_response?.candidates ??
        conversation.fullResponse?.candidates ??
        conversation.candidates;

    if (Array.isArray(candidates) && candidates.length > 0) {
        const first = candidates[0];

        const text =
            first?.content?.parts?.[0]?.text ??
            first?.content?.[0]?.text ??
            first?.text ??
            first?.message?.content?.parts?.[0]?.text;

        if (typeof text === 'string') {
            const parsed = tryParseJSON(text);
            if (parsed) return parsed;
        }
    }

    return [];
}

/* ============================================
   MAIN COMPONENT
============================================ */
export default function Details({ auth, conversation }) {
    const responses = extractResponses(conversation);
    const total = responses.length;

    const correctCount = responses.reduce((acc, r) => {
        return acc + (isResponseCorrect(r) ? 1 : 0);
    }, 0);

    const scorePercent =
        total > 0 ? ((correctCount / total) * 100).toFixed(2) : '0.00';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Conversation Details
                </h2>
            }
        >
            <Head title="Conversation Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    {/* Score Card */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium">
                            {conversation.title}
                        </h3>

                        <div className="mt-4 p-4 bg-purple-50 rounded">
                            <p className="text-2xl font-semibold text-purple-700">
                                Your Score: {scorePercent}%
                            </p>
                            <p className="text-sm text-gray-600">
                                {correctCount} of {total} correct
                            </p>
                        </div>
                    </div>

                    {/* Questions */}
                    {responses.length > 0 ? (
                        responses.map((r, qIndex) => {
                            const question =
                                r.question ??
                                r.prompt ??
                                `Question ${qIndex + 1}`;

                            const userAnswer =
                                r.user_answer ??
                                r.userAnswer ??
                                r.answer ??
                                r.selected;

                            const correctAnswer =
                                r.correct_answer ??
                                r.correct ??
                                r.answer;

                            const type = r.type ?? 'short-answer';

                            const isCorrect = isResponseCorrect(r);

                            let options = [];

                            if (Array.isArray(r.options)) {
                                options = r.options;
                            } else if (type === 'true-false') {
                                options = ['True', 'False'];
                            }

                            return (
                                <div
                                    key={qIndex}
                                    className="bg-white shadow rounded-lg p-6 mb-6"
                                >
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-500">
                                            {qIndex + 1}.
                                        </div>
                                        <div className="text-lg font-medium">
                                            {question}
                                        </div>
                                    </div>

                                    {/* Multiple Choice / True False */}
                                    {options.length > 0 ? (
                                        <div className="space-y-3">
                                            {options.map((opt, idx) => {
                                                const label = optionLabel(idx);
                                                const optText =
                                                    typeof opt === 'string'
                                                        ? opt
                                                        : opt.text ?? '';

                                                const isUserChoice =
                                                    normalize(userAnswer) ===
                                                        normalize(label) ||
                                                    normalize(userAnswer) ===
                                                        normalize(optText);

                                                const isOptCorrect =
                                                    normalize(correctAnswer) ===
                                                        normalize(label) ||
                                                    normalize(correctAnswer) ===
                                                        normalize(optText);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`border rounded p-3 ${
                                                            isOptCorrect
                                                                ? 'bg-green-50 border-green-300'
                                                                : isUserChoice
                                                                ? 'bg-purple-200 border-purple-400'
                                                                : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="font-semibold w-8">
                                                                {label})
                                                            </div>
                                                            <div className="text-sm">
                                                                {optText}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-700">
                                            <p>
                                                <strong>Your Answer:</strong>{' '}
                                                {String(userAnswer ?? '—')}
                                            </p>
                                            <p className="mt-2">
                                                <strong>Correct Answer:</strong>{' '}
                                                {String(correctAnswer ?? '—')}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        {isCorrect ? (
                                            <div className="text-green-600 font-semibold">
                                                ✓ Correct
                                            </div>
                                        ) : (
                                            <div className="text-red-600 font-semibold">
                                                ✕ Incorrect
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white shadow rounded-lg p-6">
                            No quiz responses found.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
