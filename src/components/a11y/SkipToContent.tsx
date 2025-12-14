import React from 'react';

/**
 * SkipToContent Component
 * Accessibility feature that allows keyboard users to skip navigation
 * and jump directly to the main content.
 * 
 * Usage: Place at the very beginning of your Layout/App component
 * Add id="main-content" to your main content wrapper
 */
const SkipToContent: React.FC = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-all"
        >
            Skip to main content
        </a>
    );
};

export default SkipToContent;
