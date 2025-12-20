import React from 'react';
import OutreachGallery from '../components/features/OutreachGallery';

const GalleryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary to-blue-800 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[14px]">photo_library</span>
                        Community Outreach
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Gallery
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        See our impact in the community through free health screenings, education programs, and outreach events.
                    </p>
                </div>
            </section>

            {/* Gallery Section */}
            <OutreachGallery />
        </div>
    );
};

export default GalleryPage;
