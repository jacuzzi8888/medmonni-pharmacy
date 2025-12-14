/**
 * Google Analytics 4 Integration
 * 
 * To use:
 * 1. Get your GA4 Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Add it to your .env file: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Import and use initGA() in your app entry point
 */

// Declare gtag on window
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

/**
 * Initialize Google Analytics
 * Call this once in your app entry point
 */
export function initGA(measurementId?: string): void {
    const gaId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (!gaId) {
        console.warn('[Analytics] No GA Measurement ID provided. Analytics disabled.');
        return;
    }

    // Don't initialize in development
    if (import.meta.env.DEV) {
        console.info('[Analytics] Development mode - GA disabled');
        return;
    }

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
        send_page_view: false, // We'll track manually for SPAs
    });

    console.info('[Analytics] Google Analytics initialized');
}

/**
 * Track page views (call on route change)
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
    });
}

/**
 * Track custom events
 */
export function trackEvent(
    eventName: string,
    category: string,
    label?: string,
    value?: number
): void {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
    });
}

// Pre-defined event trackers for common actions
export const Analytics = {
    // Product interactions
    viewProduct: (productName: string, productId: string) =>
        trackEvent('view_item', 'Products', productName),

    addToCart: (productName: string, price: number) =>
        trackEvent('add_to_cart', 'Products', productName, price),

    buyNow: (productName: string, price: number) =>
        trackEvent('purchase', 'Products', productName, price),

    // Search
    search: (query: string) =>
        trackEvent('search', 'Engagement', query),

    // User actions
    signIn: () => trackEvent('login', 'User'),
    signUp: () => trackEvent('sign_up', 'User'),

    // Services
    bookService: (serviceName: string) =>
        trackEvent('generate_lead', 'Services', serviceName),

    // Contact
    contactWhatsApp: () =>
        trackEvent('contact', 'Engagement', 'WhatsApp'),

    contactPhone: () =>
        trackEvent('contact', 'Engagement', 'Phone'),

    // Newsletter
    subscribe: () =>
        trackEvent('newsletter_signup', 'Engagement'),

    // PWA
    pwaInstall: () =>
        trackEvent('app_install', 'PWA'),
};

export default Analytics;
