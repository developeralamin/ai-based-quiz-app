import QuizLayout from '@/Layouts/QuizLayout';
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        num_question: "",
        text: "",
        language: "english",
    });

    const [localErrors, setLocalErrors] = useState({});

    function handleSubmit(e) {
        e.preventDefault();

        // Check if textarea is empty
        if (!data.text.trim()) {
            setLocalErrors({ text: "This field is required" });
            return;
        }
        // Clear local errors if data is valid
        setLocalErrors({});

        post("/quiz/generate", {
            preserveScroll: true,
            onError: (err) => {
                if (err.text) {
                    setLocalErrors({ text: err.text });
                }
            },
        });
    }
    return (
        <QuizLayout>
            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Quiz Generator</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                value={data.text}
                                onChange={(e) => {
                                    setData("text", e.target.value);
                                    if (e.target.value.trim()) {
                                        setLocalErrors({ text: "" }); 
                                    }
                                }}
                                className="w-full border border-gray-300 p-3 rounded-md resize-none h-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter text for quiz generation..."
                            />
                            {localErrors.text && <p className="text-red-500 text-sm mt-1">{localErrors.text}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Number of Questions</label>
                            <select
                                value={data.num_question}
                                onChange={(e) => setData("num_question", e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Select number</option>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            {errors.num_question && <p className="text-red-500 text-sm mt-1">{errors.num_question}</p>}
                        </div>

                         <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Language</label>
                            <select
                                value={data.language}
                                onChange={(e) => setData("language", e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Select Language</option>
                                    <option  value="bangla">Bangla</option>
                                    <option  value="english">English</option>
                            </select>
                            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? "Generating..." : "Generate Quiz"}
                        </button>
                    </form>
                </div>
            </div>
        </QuizLayout>
    );
}
