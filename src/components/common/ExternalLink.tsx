import React from 'react';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

/**
 * ExternalLink Component
 * Safely opens external links in new tabs with security attributes.
 * Automatically adds rel="noopener noreferrer" to prevent tab hijacking.
 * 
 * @example
 * <ExternalLink href="https://wa.me/1234567890">
 *   Contact on WhatsApp
 * </ExternalLink>
 */
const ExternalLink: React.FC<ExternalLinkProps> = ({
    href,
    children,
    className = '',
    ...props
}) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            {...props}
        >
            {children}
        </a>
    );
};

export default ExternalLink;
