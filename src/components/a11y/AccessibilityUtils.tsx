import React from 'react';

/**
 * VisuallyHidden Component
 * Hides content visually but keeps it accessible to screen readers.
 * 
 * @example
 * <button>
 *   <Icon name="menu" />
 *   <VisuallyHidden>Open navigation menu</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <span className="sr-only">
            {children}
        </span>
    );
};

/**
 * FocusRing Component
 * Wrapper that ensures proper focus indication for interactive elements.
 */
export const FocusRing: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <div
            className={`focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg ${className}`}
        >
            {children}
        </div>
    );
};

/**
 * Announces content to screen readers
 * Use for dynamic content updates, form errors, etc.
 */
interface LiveRegionProps {
    message: string;
    /** 'polite' waits for pause, 'assertive' interrupts immediately */
    priority?: 'polite' | 'assertive';
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
    message,
    priority = 'polite'
}) => {
    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {message}
        </div>
    );
};

export default VisuallyHidden;
