import React from 'react';

/**
 * JSON-LD Structured Data Component
 * Adds schema.org structured data for better SEO and rich snippets
 */

// Organization/Business structured data
export const OrganizationSchema: React.FC = () => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Pharmacy',
        'name': 'Medomni Pharmacy',
        'description': 'Your trusted pharmacy partner - Order prescriptions, book outreaches, and access health tips.',
        'url': 'https://medomni-pharmacy.vercel.app',
        'logo': 'https://medomni-pharmacy.vercel.app/logo.png',
        'image': 'https://medomni-pharmacy.vercel.app/logo.png',
        'telephone': '+234-705-235-0000',
        'email': 'info@medomni.com',
        'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'NG',
            'addressLocality': 'Lagos',
            'addressRegion': 'Lagos State',
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '6.5244',
            'longitude': '3.3792',
        },
        'openingHoursSpecification': [
            {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'opens': '08:00',
                'closes': '20:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': 'Saturday',
                'opens': '09:00',
                'closes': '18:00',
            },
        ],
        'sameAs': [
            'https://wa.me/2347052350000',
        ],
        'priceRange': '₦₦',
        'currenciesAccepted': 'NGN',
        'paymentAccepted': 'Credit Card, Debit Card, Bank Transfer',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Website Search Action (enables search box in Google results)
export const WebsiteSchema: React.FC = () => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Medomni Pharmacy',
        'url': 'https://medomni-pharmacy.vercel.app',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://medomni-pharmacy.vercel.app/shop?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Breadcrumb structured data
interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Product structured data
interface ProductSchemaProps {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    sku?: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
    name,
    description,
    image,
    price,
    currency = 'NGN',
    availability = 'InStock',
    sku,
}) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': name,
        'description': description,
        'image': image,
        'sku': sku || name.toLowerCase().replace(/\s+/g, '-'),
        'offers': {
            '@type': 'Offer',
            'price': price,
            'priceCurrency': currency,
            'availability': `https://schema.org/${availability}`,
            'seller': {
                '@type': 'Organization',
                'name': 'Medomni Pharmacy',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// FAQ structured data
interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSchemaProps {
    items: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ items }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': items.map((item) => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Combined SEO component for common pages
const StructuredData: React.FC = () => {
    return (
        <>
            <OrganizationSchema />
            <WebsiteSchema />
        </>
    );
};

export default StructuredData;
