import React from 'react';
import { Link } from 'react-router-dom';
import { PHARMACY_SERVICES } from '../../data/services';
import { PharmacyService } from '../../types/service';

interface ServiceCardProps {
    service: PharmacyService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <Link
            to={`/services?service=${encodeURIComponent(service.name)}#book-appointment`}
            className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer block"
        >
            {/* Gradient top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent-red to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative flex items-start gap-3">
                {/* Icon Container with gradient background on hover */}
                <div className="w-10 h-10 bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {service.icon}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Title with Free Badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                            {service.name}
                        </h3>
                        {service.isFree && (
                            <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 shadow-sm animate-pulse">
                                <span className="material-symbols-outlined text-[10px]">check_circle</span>
                                FREE
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {service.description}
                    </p>

                    {/* Book Now hint */}
                    <span className="mt-2 inline-flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Book Now <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
                    </span>
                </div>
            </div>
        </Link>
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
