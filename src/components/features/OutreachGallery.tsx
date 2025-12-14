import React from 'react';
import { OUTREACH_GALLERY } from '../../data/outreachGallery';

const OutreachGallery = () => {
    return (
        <div className="py-16 bg-gray-50 dark:bg-[#0c0b1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">Our Impact</span>
                    <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-4">
                        Medomni in the Community
                    </h2>
                    <p className="text-gray-500">
                        We are more than a pharmacy. We are a community partner committed to improving public health through education and free checkups.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                    {OUTREACH_GALLERY.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`relative group overflow-hidden rounded-2xl ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                                item.size === 'wide' ? 'md:col-span-2' : ''
                                }`}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${item.src}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {item.caption}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OutreachGallery;
