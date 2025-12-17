import React, { useState, useEffect } from 'react';

interface WelcomePopupProps {
    onSignUp: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onSignUp }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Check if user has seen the popup before
        const hasSeenPopup = localStorage.getItem('medomni_welcome_seen');

        if (!hasSeenPopup) {
            // Wait 3 seconds before showing popup (let user see the page first)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            localStorage.setItem('medomni_welcome_seen', 'true');
        }, 300);
    };

    const handleSignUp = () => {
        handleClose();
        onSignUp();
    };

    const handleMaybeLater = () => {
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleMaybeLater}
            />

            {/* Popup */}
            <div
                className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-primary via-primary to-blue-700 px-6 py-8 text-white text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-red/20 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">waving_hand</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to Medomni!</h2>
                        <p className="text-white/80 text-sm">Your trusted pharmacy partner in Lagos</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Join our community and enjoy exclusive benefits:
                        </p>

                        <div className="space-y-3 text-left">
                            {[
                                { icon: 'local_offer', text: 'Exclusive discounts & offers' },
                                { icon: 'notifications_active', text: 'New product alerts' },
                                { icon: 'health_and_safety', text: 'Weekly health tips' },
                                { icon: 'calendar_month', text: 'Priority appointment booking' },
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-primary text-lg">{benefit.icon}</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSignUp}
                            className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">person_add</span>
                            Create Free Account
                        </button>

                        <button
                            onClick={handleMaybeLater}
                            className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 transition-colors text-sm"
                        >
                            Maybe Later
                        </button>
                    </div>

                    {/* Trust badge */}
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Your data is safe with us
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={handleMaybeLater}
                    className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-20"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};

export default WelcomePopup;
