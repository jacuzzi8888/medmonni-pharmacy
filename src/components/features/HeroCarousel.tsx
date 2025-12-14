import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { carouselService } from '../../services/carouselService';
import { CAROUSEL_SLIDES } from '../../data/carouselSlides';
import type { CarouselSlide } from '../../types/carousel';

// Map database slide to display format
interface DisplaySlide {
    id: string | number;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink?: string;
    image: string;
    align: 'left' | 'center' | 'right';
}

const SLIDE_DURATION = 5000; // 5 seconds per slide

const HeroCarousel = () => {
    const [slides, setSlides] = useState<DisplaySlide[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const timeoutRef = useRef<any>(null);
    const progressRef = useRef<any>(null);

    // Fetch slides from database on mount
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const dbSlides = await carouselService.getActiveSlides();

                if (dbSlides.length > 0) {
                    // Transform database slides to display format
                    const displaySlides: DisplaySlide[] = dbSlides.map(slide => ({
                        id: slide.id,
                        title: slide.title,
                        subtitle: slide.subtitle || slide.description || '',
                        cta: slide.button_text || 'Learn More',
                        ctaLink: slide.button_link || '#',
                        image: slide.image_url,
                        align: 'center' as const, // Default alignment
                    }));
                    setSlides(displaySlides);
                } else {
                    // Fallback to static data if no DB slides
                    setSlides(CAROUSEL_SLIDES.map(s => ({
                        ...s,
                        id: String(s.id),
                        ctaLink: '#',
                    })));
                }
            } catch (error) {
                console.error('[HeroCarousel] Error fetching slides:', error);
                // Fallback to static data on error
                setSlides(CAROUSEL_SLIDES.map(s => ({
                    ...s,
                    id: String(s.id),
                    ctaLink: '#',
                })));
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Progress bar animation
    useEffect(() => {
        if (isPaused || slides.length === 0) {
            return;
        }

        setProgress(0);
        const startTime = Date.now();

        progressRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            setProgress(newProgress);
        }, 50);

        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, SLIDE_DURATION);

        return () => {
            clearTimeout(timeoutRef.current);
            clearInterval(progressRef.current);
        };
    }, [currentIndex, isPaused, slides.length]);

    const goToSlide = (index: number) => {
        setProgress(0);
        setCurrentIndex(index);
    };
    const nextSlide = () => {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };
    const prevSlide = () => {
        setProgress(0);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

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

    // Loading state with skeleton
    if (isLoading) {
        return (
            <div className="relative w-full h-[280px] md:h-[500px] bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 skeleton" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        <p className="text-white/60 text-sm">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // No slides state
    if (slides.length === 0) {
        return (
            <div className="relative w-full h-[280px] md:h-[500px] bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Welcome to Medomni Pharmacy</h2>
                    <p className="text-base md:text-xl">Your Health, Our Priority</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-[280px] md:h-[500px] overflow-hidden bg-gray-900 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

                    {/* Content with entrance animation */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className={`max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-${slide.align}`}>
                            <div className={`max-w-2xl ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto' : ''}`}>
                                <h2
                                    className={`text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight ${index === currentIndex ? 'animate-fade-in-up' : ''
                                        }`}
                                    style={{
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                        animationDelay: '100ms'
                                    }}
                                >
                                    {slide.title}
                                </h2>
                                <p
                                    className={`text-sm md:text-lg lg:text-xl text-gray-200 mb-4 md:mb-8 font-medium ${index === currentIndex ? 'animate-fade-in-up' : ''
                                        }`}
                                    style={{
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                        animationDelay: '200ms'
                                    }}
                                >
                                    {slide.subtitle}
                                </p>
                                {slide.ctaLink && slide.ctaLink !== '#' ? (
                                    <Link
                                        to={slide.ctaLink}
                                        className={`inline-flex items-center gap-2 bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full text-sm md:text-base transition-all transform hover:scale-105 shadow-lg btn-lift shimmer-overlay group/btn ${index === currentIndex ? 'animate-fade-in-up' : ''
                                            }`}
                                        style={{ animationDelay: '300ms' }}
                                    >
                                        {slide.cta}
                                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                    </Link>
                                ) : (
                                    <button
                                        className={`inline-flex items-center gap-2 bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full text-sm md:text-base transition-all transform hover:scale-105 shadow-lg btn-lift shimmer-overlay group/btn ${index === currentIndex ? 'animate-fade-in-up' : ''
                                            }`}
                                        style={{ animationDelay: '300ms' }}
                                    >
                                        {slide.cta}
                                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Manual Navigation Arrows - Enhanced */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center border border-white/20 hover:border-white/40 hover:scale-110"
                aria-label="Previous Slide"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center border border-white/20 hover:border-white/40 hover:scale-110"
                aria-label="Next Slide"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Progress Bar Indicators */}
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-20 px-8 md:px-4 max-w-[200px] md:max-w-xl mx-auto">
                <div className="flex gap-1 md:gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className="flex-1 h-0.5 md:h-1 rounded-full bg-white/30 overflow-hidden transition-all hover:bg-white/40"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div
                                className={`h-full bg-white rounded-full transition-all ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{
                                    width: index === currentIndex ? `${progress}%` : '0%',
                                    transition: index === currentIndex ? 'none' : 'width 0.3s ease'
                                }}
                            />
                        </button>
                    ))}
                </div>
                {/* Slide counter - hidden on mobile */}
                <div className="hidden md:block text-center mt-3 text-white/60 text-xs font-medium">
                    {currentIndex + 1} / {slides.length}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;

