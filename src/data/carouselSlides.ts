// Static carousel slides type for display (different from DB CarouselSlide type)
interface StaticCarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink?: string;
    image: string;
    align: 'left' | 'center' | 'right';
}

export const CAROUSEL_SLIDES: StaticCarouselSlide[] = [
    {
        id: 1,
        title: "Season's Greetings!",
        subtitle: "Wishing you joy, health and happiness this Christmas 🎄",
        cta: "Shop Now",
        ctaLink: "/shop",
        image: "/christmas-greetings.png",
        align: "center"
    },
    {
        id: 2,
        title: "Grand Opening Celebration",
        subtitle: "We're officially open! Visit us at Lekki Phase 1, Lagos.",
        cta: "Visit Us",
        ctaLink: "/contact",
        image: "/opening-ceremony.jpg",
        align: "center"
    },
    {
        id: 3,
        title: "Welcome to Medomni",
        subtitle: "Experience quality healthcare products in our modern store.",
        cta: "Explore Products",
        ctaLink: "/shop",
        image: "/store-interior.png",
        align: "center"
    },
    {
        id: 4,
        title: "Community Outreach 2023",
        subtitle: "Bringing healthcare to rural communities across Lagos.",
        cta: "View Gallery",
        ctaLink: "/about#gallery",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsEn40SXK2KX0zz986cqO3PMDhQO570JXi9UirPLBh_LkAaRtesMka6_sXIbQvcM9ww1aR3sB-ei1G9vcF5uIEQZmIWfJ7NlbR0h-8vmXS5cf0-fdBWTXVBCt9cHB32_kJ-PRMGYmBOhdAfwrm1rWQhsfNbjrdYQxxlFgWGUGPNg9keT1HUKnWciiqlxFVgnmwaoJnZ1RaheBKV5DEu3aT1tIoTDLa7203ODg7jzxdQ0darKmLxt5h0FkliUbXAXsBCSlmk-ospsY",
        align: "center"
    },
    {
        id: 5,
        title: "Free Delivery on Monthly Refills",
        subtitle: "Never run out of your essential medication again.",
        cta: "Shop Subscriptions",
        ctaLink: "/shop",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070",
        align: "left"
    },
    {
        id: 6,
        title: "New Arrival: Blood Pressure Monitors",
        subtitle: "Hospital grade accuracy in the comfort of your home.",
        cta: "Buy Now",
        ctaLink: "/shop",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1979",
        align: "right"
    }
];


