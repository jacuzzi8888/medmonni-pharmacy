import React, { useState, useEffect } from 'react';

// =============================================================================
// Scroll To Top Button Component
// =============================================================================

interface ScrollToTopProps {
    threshold?: number; // Scroll distance before showing button
    smooth?: boolean;   // Use smooth scrolling
    className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
    threshold = 400,
    smooth = true,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setIsVisible(scrollTop > threshold);
        };

        // Check initial scroll position
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    const scrollToTop = () => {
        if (smooth) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            window.scrollTo(0, 0);
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-to-top ${isVisible ? 'visible' : ''} ${className}`}
            aria-label="Scroll to top"
            title="Scroll to top"
            style={{
                // Override smooth scroll if user prefers reduced motion
                scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth',
            }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
};

export default ScrollToTop;
