import React from 'react';
import { PHARMACY_SERVICES } from '../../data/services';
import { PharmacyService } from '../../types/service';

interface ServiceCardProps {
    service: PharmacyService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-3xl">
                        {service.icon}
                    </span>
                </div>

                {/* Free Badge */}
                {service.isFree && (
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
                        FREE
                    </span>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {service.description}
                </p>
            </div>
        </div>
    );
};

const PharmacyServicesSection: React.FC = () => {
    return (
        <div className="py-16 bg-gray-50 dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">
                        What We Offer
                    </span>
                    <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-4">
                        Our Pharmacy Services
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        From free health screenings to home delivery, we're committed to making healthcare accessible and convenient for you.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PHARMACY_SERVICES.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <a
                        href="https://wa.me/2347052350000?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20pharmacy%20services"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        Inquire About Services
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PharmacyServicesSection;
