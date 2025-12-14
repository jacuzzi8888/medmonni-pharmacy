import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[150px] md:text-[200px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary to-accent-red rounded-full flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-white text-4xl md:text-5xl">
                                sentiment_dissatisfied
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Page Not Found
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm md:text-base">
                    Oops! The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-700 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Go Home
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        Browse Products
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Or try one of these popular pages:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { label: 'Services', path: '/services', icon: 'medical_services' },
                            { label: 'Contact', path: '/contact', icon: 'call' },
                            { label: 'FAQs', path: '/faqs', icon: 'help' },
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Need help? Contact us on{' '}
                        <a
                            href="https://wa.me/2347052350000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-semibold hover:underline"
                        >
                            WhatsApp
                        </a>
                        {' '}or call{' '}
                        <a
                            href="tel:+2347052350000"
                            className="text-primary font-semibold hover:underline"
                        >
                            +234 705 235 0000
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
