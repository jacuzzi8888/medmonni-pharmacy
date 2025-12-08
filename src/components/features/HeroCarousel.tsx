import React, { useState, useEffect, useRef } from 'react';
import { CAROUSEL_SLIDES } from '../../data/carouselSlides';

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const timeoutRef = useRef<any>(null);

    // Auto-play logic
    useEffect(() => {
        if (isPaused) return;
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5000);
        return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, isPaused]);

    const goToSlide = (index: number) => setCurrentIndex(index);
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

    // Swipe handlers
    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    return (
        <div
            className="relative w-full h-[500px] overflow-hidden bg-gray-900 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {CAROUSEL_SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out"
                        style={{
                            backgroundImage: `url('${slide.image}')`,
                            transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className={`max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-${slide.align}`}>
                            <div className={`max-w-2xl ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto' : ''}`}>
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                                <button className="bg-accent-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg border-2 border-transparent hover:border-white/20">
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Manual Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
                aria-label="Previous Slide"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
                aria-label="Next Slide"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
                {CAROUSEL_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-accent-red w-8"
                            : "bg-white/50 hover:bg-white/80 w-2"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
