import React, { useState, useEffect } from 'react';

// Helper function to check if store is currently open
const isStoreOpen = (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1-6 = Mon-Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    if (day === 0) {
        // Sunday: 12pm - 6pm
        return currentTime >= 12 && currentTime < 18;
    } else {
        // Monday - Saturday: 8am - 9pm
        return currentTime >= 8 && currentTime < 21;
    }
};

const StoreInfoSection = () => {
    const [isOpen, setIsOpen] = useState(isStoreOpen());

    // Update open status every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setIsOpen(isStoreOpen());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-16 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">Visit Us</span>
                    <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-4">
                        Find Our Pharmacy
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We're conveniently located in Lekki Phase 1. Stop by for personalized care and expert advice.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Address Card */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Location</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            1 Niyi Okunubi Street<br />
                            Lekki Phase 1<br />
                            Lagos, Nigeria
                        </p>
                        <a
                            href="https://www.google.com/maps/search/1+Niyi+Okunubi+Street+Lekki+Phase+1+Lagos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent-red transition-colors"
                        >
                            Get Directions
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </a>
                    </div>

                    {/* Hours Card */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Opening Hours</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Monday - Saturday</span>
                                <span className="font-semibold text-gray-900 dark:text-white">8:00 AM - 9:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                                <span className="font-semibold text-gray-900 dark:text-white">12:00 PM - 6:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <span className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className={`font-medium text-sm ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {isOpen ? 'Open Now' : 'Closed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">call</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Us</h3>
                        </div>
                        <div className="space-y-4">
                            <a
                                href="tel:07052350000"
                                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">phone</span>
                                07052350000
                            </a>
                            <a
                                href="mailto:medomnipharmacy@gmail.com"
                                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                medomnipharmacy@gmail.com
                            </a>
                            <a
                                href="https://wa.me/2347052350000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-full hover:bg-[#128C7E] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.55C8.76 21.36 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.91C20.28 16.43 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.74 7.91 19L7.31 18.66L4.2 19.56L5.12 16.55L4.85 15.93C4.1 14.63 3.79 13.25 3.79 11.91C3.79 7.39 7.52 3.67 12.04 3.67"></path>
                                </svg>
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfoSection;
