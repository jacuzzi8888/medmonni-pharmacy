import React, { useState, useEffect } from 'react';
import { galleryService, GalleryImage } from '../../services/galleryService';
import { OUTREACH_GALLERY } from '../../data/outreachGallery';

const OutreachGallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await galleryService.getActive();
                setImages(data);
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                // Fallback to static data on error
                setImages([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    // Use static data as fallback if no DB images
    const displayImages = images.length > 0 ? images : OUTREACH_GALLERY.map((item, idx) => ({
        id: String(item.id),
        title: item.caption,
        caption: null,
        image_url: item.src,
        category: 'Outreach',
        size: item.size as 'small' | 'large' | 'wide',
        is_active: true,
        display_order: idx,
        created_at: '',
        updated_at: '',
    }));

    return (
        <div className="py-8 md:py-16 bg-gray-50 dark:bg-[#0c0b1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 md:mb-10 max-w-2xl mx-auto">
                    <span className="text-accent-red font-bold tracking-wider text-[10px] md:text-xs uppercase mb-1 md:mb-2 block">Our Impact</span>
                    <h2 className="text-primary dark:text-white text-xl md:text-3xl font-bold tracking-tight mb-2 md:mb-4">
                        Medomni in the Community
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base hidden md:block">
                        We are more than a pharmacy. We are a community partner committed to improving public health through education and free checkups.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[120px] md:auto-rows-[200px]">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`skeleton rounded-xl md:rounded-2xl ${i === 1 ? 'md:col-span-2 md:row-span-2' : ''}`} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[120px] md:auto-rows-[200px]">
                        {displayImages.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group overflow-hidden rounded-2xl ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                                    item.size === 'wide' ? 'md:col-span-2' : ''
                                    }`}
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${item.image_url}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {item.title}
                                    </p>
                                    {item.caption && (
                                        <p className="text-white/70 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {item.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutreachGallery;

