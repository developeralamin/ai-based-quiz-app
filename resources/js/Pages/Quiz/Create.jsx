import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        num_question: "",
        text: "",
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Quiz QUIZ
                </h2>
            }
        >
            <Head title="Quiz" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold mb-4">AI Quiz Generator</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={data.text}
                                onChange={(e) => {
                                    setData("text", e.target.value);
                                    if (e.target.value.trim()) {
                                        setLocalErrors({ text: "" }); 
                                    }
                                }}
                                className="w-full border p-2 rounded-md resize-none h-40"
                                placeholder="Enter text for quiz generation..."
                            />
                            {localErrors.text && <p className="text-red-500">{localErrors.text}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Number of Questions</label>
                            <select
                                value={data.num_question}
                                onChange={(e) => setData("num_question", e.target.value)}
                                className="w-full border p-2 rounded-md"
                            >
                                <option value="">Select number</option>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            {errors.num_question && <p className="text-red-500">{errors.num_question}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            {processing ? "Generating..." : "Generate"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
