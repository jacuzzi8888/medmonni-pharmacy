import React from 'react';
import AppointmentForm from '../components/features/AppointmentForm';

const PHARMACY_SERVICES = [
    {
        icon: 'medication',
        title: 'Prescription Services',
        description: 'Get your prescriptions filled quickly and accurately by our licensed pharmacists.',
        color: 'from-blue-500 to-blue-600',
    },
    {
        icon: 'stethoscope',
        title: 'Health Consultations',
        description: 'Speak with our pharmacists about your medications, health concerns, and wellness goals.',
        color: 'from-green-500 to-green-600',
    },
    {
        icon: 'monitor_heart',
        title: 'Blood Pressure Monitoring',
        description: 'Free blood pressure checks to help you stay on top of your cardiovascular health.',
        color: 'from-red-500 to-red-600',
    },
    {
        icon: 'bloodtype',
        title: 'Blood Sugar Testing',
        description: 'Quick and accurate glucose monitoring for diabetic patients and health-conscious individuals.',
        color: 'from-purple-500 to-purple-600',
    },
    {
        icon: 'vaccines',
        title: 'Vaccination Services',
        description: 'Stay protected with our vaccination services including flu shots and travel vaccines.',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        icon: 'local_shipping',
        title: 'Home Delivery',
        description: 'Get your medications delivered right to your doorstep anywhere in Lagos.',
        color: 'from-primary to-blue-700',
    },
];

const ServicesPage: React.FC = () => {
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
                        <span className="material-symbols-outlined text-[14px]">medical_services</span>
                        Our Services
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Comprehensive Pharmacy Care
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        From prescriptions to health consultations, we're here to support your wellness journey.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PHARMACY_SERVICES.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-2xl text-white">{service.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Appointment Booking Section */}
            <section className="py-16 bg-white dark:bg-gray-800" id="book-appointment">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 text-accent-red font-bold tracking-wider text-xs uppercase mb-2">
                            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                            Book an Appointment
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Schedule Your Visit
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            Choose a service and pick a time that works for you. Our team will be ready to assist you.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 md:p-10">
                        <AppointmentForm />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
                        <p className="text-white/80 mb-6 max-w-xl mx-auto">
                            Our pharmacists are available during business hours to answer your questions.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:07052350000"
                                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
                            >
                                <span className="material-symbols-outlined">call</span>
                                Call Now
                            </a>
                            <a
                                href="https://wa.me/2347052350000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
                                </svg>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
