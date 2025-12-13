import React from 'react';

// =============================================================================
// Types
// =============================================================================

interface SkeletonProps {
    className?: string;
}

// =============================================================================
// Base Skeleton Component
// =============================================================================

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return <div className={`skeleton ${className}`} aria-hidden="true" />;
};

// =============================================================================
// Text Skeleton
// =============================================================================

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 1, className = '' }) => {
    return (
        <div className={className} aria-hidden="true">
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className="skeleton skeleton-text"
                    style={{
                        width: index === lines - 1 && lines > 1 ? '75%' : '100%',
                    }}
                />
            ))}
        </div>
    );
};

// =============================================================================
// Title Skeleton
// =============================================================================

export const SkeletonTitle: React.FC<SkeletonProps> = ({ className = '' }) => {
    return <div className={`skeleton skeleton-title ${className}`} aria-hidden="true" />;
};

// =============================================================================
// Image Skeleton
// =============================================================================

interface SkeletonImageProps {
    aspectRatio?: 'square' | 'video' | 'portrait';
    className?: string;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
    aspectRatio = 'square',
    className = ''
}) => {
    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
    };

    return (
        <div
            className={`skeleton ${aspectClasses[aspectRatio]} w-full rounded-lg ${className}`}
            aria-hidden="true"
        />
    );
};

// =============================================================================
// Avatar Skeleton
// =============================================================================

interface SkeletonAvatarProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div
            className={`skeleton rounded-full ${sizeClasses[size]} ${className}`}
            aria-hidden="true"
        />
    );
};

// =============================================================================
// Button Skeleton
// =============================================================================

interface SkeletonButtonProps {
    width?: string;
    className?: string;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
    width = '6rem',
    className = ''
}) => {
    return (
        <div
            className={`skeleton h-10 rounded-full ${className}`}
            style={{ width }}
            aria-hidden="true"
        />
    );
};

// =============================================================================
// Product Card Skeleton
// =============================================================================

export const SkeletonProductCard: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`skeleton-card ${className}`} aria-hidden="true">
            <SkeletonImage aspectRatio="square" className="mb-4" />
            <SkeletonTitle />
            <SkeletonText lines={2} className="mb-3" />
            <div className="flex justify-between items-center">
                <div className="skeleton h-6 w-20 rounded" />
                <SkeletonButton width="5rem" />
            </div>
        </div>
    );
};

// =============================================================================
// Category Skeleton (Circular)
// =============================================================================

export const SkeletonCategory: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`flex flex-col items-center gap-2 ${className}`} aria-hidden="true">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="skeleton h-4 w-16 rounded" />
        </div>
    );
};

// =============================================================================
// Service Card Skeleton
// =============================================================================

export const SkeletonServiceCard: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`skeleton-card flex items-start gap-3 ${className}`} aria-hidden="true">
            <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1">
                <div className="skeleton h-4 w-24 rounded mb-2" />
                <SkeletonText lines={2} />
            </div>
        </div>
    );
};

// =============================================================================
// Table Row Skeleton
// =============================================================================

interface SkeletonTableRowProps {
    columns?: number;
    className?: string;
}

export const SkeletonTableRow: React.FC<SkeletonTableRowProps> = ({
    columns = 4,
    className = ''
}) => {
    return (
        <tr className={className} aria-hidden="true">
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                    <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                </td>
            ))}
        </tr>
    );
};

// =============================================================================
// Carousel Slide Skeleton
// =============================================================================

export const SkeletonCarouselSlide: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`relative w-full aspect-[21/9] ${className}`} aria-hidden="true">
            <div className="skeleton absolute inset-0 rounded-2xl" />
            <div className="absolute bottom-8 left-8 space-y-3">
                <div className="skeleton h-8 w-64 rounded" />
                <div className="skeleton h-4 w-96 rounded" />
                <div className="skeleton h-10 w-32 rounded-full mt-4" />
            </div>
        </div>
    );
};

// =============================================================================
// Article Card Skeleton
// =============================================================================

export const SkeletonArticleCard: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`flex items-start gap-3 p-3 ${className}`} aria-hidden="true">
            <div className="skeleton w-12 h-12 rounded-lg flex-shrink-0" />
            <div className="flex-1">
                <div className="skeleton h-4 w-full rounded mb-2" />
                <div className="skeleton h-3 w-20 rounded" />
            </div>
        </div>
    );
};

export default Skeleton;
