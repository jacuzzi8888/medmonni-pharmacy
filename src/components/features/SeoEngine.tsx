import React from "react";
import { CAROUSEL_SLIDES } from "../../data/carouselSlides";
import { PRODUCTS } from "../../data/products";

const SeoEngine = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Pharmacy",
        "name": "Medomni Pharmacy",
        "image": CAROUSEL_SLIDES[0].image,
        "description": "Trusted healthcare provider offering prescriptions, wellness products, and community outreach in Lagos, Nigeria.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lagos",
            "addressCountry": "NG"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Pharmacy Goods",
            "itemListElement": PRODUCTS.map(p => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": p.name,
                    "description": p.description,
                    "image": p.img
                },
                "priceCurrency": "NGN",
                "price": p.price.replace(/[^0-9]/g, '')
            }))
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
};

export default SeoEngine;
