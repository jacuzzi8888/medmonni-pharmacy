import React, { useState } from 'react';
import { newsletterService } from '../../services/newsletterService';

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [isFocused, setIsFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setErrorMessage("");

        try {
            await newsletterService.subscribe({ email });
            setStatus("success");
            setEmail("");
            // Reset after showing success
            setTimeout(() => setStatus("idle"), 4000);
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message || "Failed to subscribe. Please try again.");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="bg-gradient-to-br from-primary via-primary to-blue-900 py-16 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-red/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Section badge */}
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    Newsletter
                </span>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Join the Medomni Community
                </h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                    Subscribe for exclusive health tips, early access to outreach programs, and special discount codes.
                </p>

                {status === "success" ? (
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl animate-fade-in-up shadow-lg">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                            <span className="material-symbols-outlined text-2xl">check</span>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-lg">You're subscribed!</p>
                            <p className="text-white/80 text-sm">Check your inbox for a welcome email.</p>
                        </div>
                    </div>
                ) : (
                    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubmit}>
                        {/* Input with icon prefix */}
                        <div className={`relative flex-1 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className={`w-full rounded-full pl-12 pr-6 py-3.5 border-2 text-gray-900 shadow-lg transition-all duration-300 focus:outline-none ${isFocused
                                    ? 'border-accent-red ring-4 ring-accent-red/20 shadow-xl'
                                    : 'border-transparent'
                                    }`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                required
                                disabled={status === "loading"}
                            />
                        </div>

                        {/* Gradient button with loading state */}
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-full px-8 py-3.5 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 btn-lift shimmer-overlay flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {status === "loading" ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Subscribe</span>
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Trust badges */}
                <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Secure
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        No Spam
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                        Unsubscribe Anytime
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;

