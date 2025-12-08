import React, { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, success

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setStatus("success");
            setEmail("");
            // Simulate API call
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="bg-primary py-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the Medomni Community</h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">Subscribe for exclusive health tips, early access to outreach programs, and special discount codes.</p>

                {status === "success" ? (
                    <div className="bg-green-500/20 backdrop-blur border border-green-500 text-white px-6 py-4 rounded-xl inline-block animate-fade-in-up">
                        <span className="font-bold flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> You are subscribed!</span>
                    </div>
                ) : (
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 rounded-full px-6 py-3 border-0 focus:ring-2 focus:ring-accent-red text-gray-900 shadow-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button className="bg-accent-red text-white font-bold rounded-full px-8 py-3 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform">
                            Subscribe
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Newsletter;
