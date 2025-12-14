import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    /** If true, load immediately (for above-the-fold content) */
    priority?: boolean;
    /** Fallback element if image fails to load */
    fallback?: React.ReactNode;
    /** Function called on error */
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * OptimizedImage Component
 * - Lazy loads images by default using native loading="lazy"
 * - Shows skeleton placeholder while loading
 * - Graceful error handling with fallback
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    style,
    priority = false,
    fallback,
    onError,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Check if image is already cached/loaded
    useEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoaded(true);
        }
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(e);
    };

    if (hasError && fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className={`relative ${className}`} style={style}>
            {/* Skeleton placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-inherit" />
            )}

            {/* Actual image */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                style={style}
            />
        </div>
    );
};

export default OptimizedImage;

/**
 * Simple lazy image that just adds loading="lazy"
 * Use this for simple cases where you don't need the full OptimizedImage features
 */
export const LazyImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }> = ({
    priority = false,
    ...props
}) => (
    <img
        {...props}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
    />
);
