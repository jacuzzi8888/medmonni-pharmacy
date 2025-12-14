import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * PageTransition Component
 * Adds a subtle fade-in effect when navigating between pages
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Start fade out
        setIsVisible(false);

        // After fade out, update children and fade in
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsVisible(true);
        }, 150); // Match transition duration

        return () => clearTimeout(timer);
    }, [location.pathname]); // Trigger on route change

    // Initial mount - just show immediately
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`transition-opacity duration-150 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {displayChildren}
        </div>
    );
};

export default PageTransition;
