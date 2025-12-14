import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * Tracks whether a CSS media query matches.
 * 
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isRetina = useMediaQuery('(min-resolution: 2dppx)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        // Update state when query changes
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Set initial value
        setMatches(mediaQuery.matches);

        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

// Predefined breakpoints matching Tailwind
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export default useMediaQuery;
