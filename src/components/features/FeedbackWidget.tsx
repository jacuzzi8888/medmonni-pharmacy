import React, { useState } from "react";
import { feedbackService } from "../../services/feedbackService";

const FeedbackWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState<"suggestion" | "complaint" | "praise" | "question">("suggestion");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setStatus("sending");

        try {
            await feedbackService.submit({
                type: feedbackType,
                message: feedback,
                page_url: window.location.href,
            });
            setStatus("sent");
            setTimeout(() => {
                setStatus("idle");
                setIsOpen(false);
                setFeedback("");
            }, 2000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    const typeOptions = [
        { value: "suggestion", label: "💡 Suggestion", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
        { value: "question", label: "❓ Question", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
        { value: "praise", label: "👍 Praise", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
        { value: "complaint", label: "⚠️ Issue", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    ];

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    Share Feedback
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80 animate-scale-up origin-bottom-left">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Share Feedback</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    {status === "sent" ? (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-center text-sm font-medium">
                            ✓ Thank you! We've received your feedback.
                        </div>
                    ) : status === "error" ? (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl text-center text-sm font-medium">
                            Failed to send. Please try again.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Type selector */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {typeOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFeedbackType(opt.value as typeof feedbackType)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${feedbackType === opt.value
                                                ? opt.color + " ring-2 ring-offset-1 ring-primary"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm p-3 focus:ring-2 focus:ring-primary focus:border-primary mb-3 text-gray-800 dark:text-white resize-none outline-none"
                                rows={3}
                                placeholder="What's on your mind?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                                disabled={status === "sending"}
                            />
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {status === "sending" ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        Send Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;

