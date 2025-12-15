import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAboutContent, AboutContent } from '../data/aboutContent';

const AboutPage: React.FC = () => {
    const [content, setContent] = useState<AboutContent | null>(null);

    useEffect(() => {
        setContent(getAboutContent());
    }, []);

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary to-blue-800 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-red rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        About Us
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {content.heroTagline}
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        {content.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl text-white">flag</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.mission.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {content.mission.content}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-red to-red-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl text-white">visibility</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.vision.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {content.vision.content}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            The Medomni Difference
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {content.whyChooseUs.map((item, i) => (
                            <div key={i} className="text-center p-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-gradient-to-r from-primary to-blue-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: content.stats.customers, label: 'Happy Customers' },
                            { value: content.stats.products, label: 'Products Available' },
                            { value: content.stats.support, label: 'WhatsApp Support' },
                            { value: content.stats.outreaches, label: 'Community Outreaches' },
                        ].map((stat, i) => (
                            <div key={i} className="text-white">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-white/70 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Store Image */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <img
                                src="/store-interior.png"
                                alt="Medomni Pharmacy Store"
                                className="rounded-2xl shadow-xl w-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">
                                Visit Our Store
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Experience Pharmacy Excellence
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                {content.storeInfo.description}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    {content.storeInfo.address}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    {content.storeInfo.hours}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-primary">call</span>
                                    {content.storeInfo.phone}
                                </div>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 mt-6 bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-colors"
                            >
                                Contact Us
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gray-100 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {content.ctaTitle}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {content.ctaSubtitle}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors"
                        >
                            Shop Now
                        </Link>
                        <Link
                            to="/services#book-appointment"
                            className="inline-flex items-center gap-2 bg-accent-red text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
