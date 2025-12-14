import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver Hook
 * Tracks when an element enters/exits the viewport.
 * Great for lazy loading, infinite scroll, and animations.
 * 
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting, entry]
 * 
 * @example
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
 * 
 * return (
 *   <div ref={ref} className={isVisible ? 'animate-in' : 'opacity-0'}>
 *     Content
 *   </div>
 * );
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
    options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean, IntersectionObserverEntry | null] {
    const {
        threshold = 0,
        root = null,
        rootMargin = '0px',
        freezeOnceVisible = false,
    } = options;

    const ref = useRef<T>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

    const frozen = freezeOnceVisible && isIntersecting;

    useEffect(() => {
        const element = ref.current;
        if (!element || frozen) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                setEntry(entry);
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, root, rootMargin, frozen]);

    return [ref, isIntersecting, entry];
}

export default useIntersectionObserver;
