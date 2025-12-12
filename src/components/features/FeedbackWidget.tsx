import React, { useState } from "react";

const FeedbackWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setIsOpen(false);
            setFeedback("");
        }, 2000);
    };

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
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72 animate-scale-up origin-bottom-left">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Feedback / Comments</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    {sent ? (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-center text-sm font-medium">
                            Thank you! We've received your feedback.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-primary mb-3 text-gray-800 dark:text-white resize-none"
                                rows={3}
                                placeholder="What do you think about this page?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                            />
                            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
                                Send Feedback
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;
