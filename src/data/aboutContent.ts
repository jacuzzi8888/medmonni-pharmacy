// About Page Content Types and Default Data
// This can be managed via admin panel and later migrated to Supabase

export interface AboutContent {
    id: string;
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    stats: {
        customers: string;
        products: string;
        support: string;
        outreaches: string;
    };
    whyChooseUs: {
        icon: string;
        title: string;
        description: string;
    }[];
    storeInfo: {
        address: string;
        hours: string;
        phone: string;
        description: string;
    };
    heroTagline: string;
    heroSubtitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
    id: 'about-content',
    mission: {
        title: 'Our Mission',
        content: 'To provide accessible, affordable, and high-quality pharmaceutical care to every Nigerian, ensuring that healthcare is never out of reach. We believe in treating every customer like family.'
    },
    vision: {
        title: 'Our Vision',
        content: "To become Nigeria's most trusted pharmacy brand, known for excellence in service, community engagement, and a commitment to improving health outcomes across the nation."
    },
    stats: {
        customers: '10,000+',
        products: '500+',
        support: '24/7',
        outreaches: '50+'
    },
    whyChooseUs: [
        { icon: 'verified', title: 'Genuine Products', description: 'All medications sourced from verified suppliers' },
        { icon: 'support_agent', title: 'Expert Pharmacists', description: 'Professional advice from licensed experts' },
        { icon: 'local_shipping', title: 'Fast Delivery', description: 'Same-day delivery within Lagos' },
        { icon: 'favorite', title: 'Customer Care', description: 'Dedicated support for all your needs' },
    ],
    storeInfo: {
        address: '1 Niyi Okunubi Street, Lekki Phase 1, Lagos',
        hours: 'Mon-Sat: 8AM-9PM | Sun: 12PM-6PM',
        phone: '07052350000',
        description: 'Located in Lekki Phase 1, our modern pharmacy offers a welcoming environment with friendly staff ready to assist you. Whether you need prescription medications, over-the-counter products, or health advice, we\'re here for you.'
    },
    heroTagline: 'Your Trusted Pharmacy Partner',
    heroSubtitle: 'Providing quality healthcare products and exceptional service to our community since day one.',
    ctaTitle: 'Ready to Experience the Medomni Difference?',
    ctaSubtitle: 'Browse our products or book an appointment today.'
};

// Local storage key for persisting changes
export const ABOUT_CONTENT_KEY = 'medomni_about_content';

// Helper to get content (from localStorage or default)
export const getAboutContent = (): AboutContent => {
    if (typeof window === 'undefined') return DEFAULT_ABOUT_CONTENT;

    const stored = localStorage.getItem(ABOUT_CONTENT_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return DEFAULT_ABOUT_CONTENT;
        }
    }
    return DEFAULT_ABOUT_CONTENT;
};

// Helper to save content
export const saveAboutContent = (content: AboutContent): void => {
    localStorage.setItem(ABOUT_CONTENT_KEY, JSON.stringify(content));
};
