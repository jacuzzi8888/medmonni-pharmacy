import React, { useState, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import StoreInfoSection from "./src/components/features/StoreInfoSection";

// --- Mock CMS Data (Simulating Sanity.io) ---

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Community Outreach 2023",
    subtitle: "Bringing healthcare to rural communities across Lagos.",
    cta: "View Gallery",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsEn40SXK2KX0zz986cqO3PMDhQO570JXi9UirPLBh_LkAaRtesMka6_sXIbQvcM9ww1aR3sB-ei1G9vcF5uIEQZmIWfJ7NlbR0h-8vmXS5cf0-fdBWTXVBCt9cHB32_kJ-PRMGYmBOhdAfwrm1rWQhsfNbjrdYQxxlFgWGUGPNg9keT1HUKnWciiqlxFVgnmwaoJnZ1RaheBKV5DEu3aT1tIoTDLa7203ODg7jzxdQ0darKmLxt5h0FkliUbXAXsBCSlmk-ospsY",
    align: "center"
  },
  {
    id: 2,
    title: "Free Delivery on Monthly Refills",
    subtitle: "Never run out of your essential medication again.",
    cta: "Shop Subscriptions",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070",
    align: "left"
  },
  {
    id: 3,
    title: "New Arrival: Blood Pressure Monitors",
    subtitle: "Hospital grade accuracy in the comfort of your home.",
    cta: "Buy Now",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1979",
    align: "right"
  }
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Vitamin C 1000mg",
    price: "₦3,500",
    description: "Immune system support booster.",
    fullDescription: "High-potency Vitamin C supplement to support immune health, collagen production, and antioxidant protection. Suitable for vegetarians.",
    dosage: "Take one tablet daily with food.",
    ingredients: "Ascorbic Acid (1000mg), Rose Hips, Citrus Bioflavonoids.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLjKmlVLW5ha22pifupEK7usCfWUIx1PTy4k4K6M4-RfsykWRHkm3EQq8FpzvQ8DIKZg_1iOxWOsMOOwiLMmDtCfpQ_xppc7aycaiUyjYmVEKXLHgma9pyiL_oYSyEdBNq8EQ8w4oNZOp2Bx8IsE3Ib_7T7M9_JDinOEIEu1DQVl_GBPnNkmONByV7TlsGElfZies4T_KNfwMKBatf2QeFLRkqo0U5jO-23UGj3lxYFQZkUUkg3FXLk9ygZiSYRVT8qFVD1UD3xz4",
    paystackLink: "https://paystack.com/buy/simulated-link-1",
    badge: "Best Seller",
    category: "Wellness"
  },
  {
    id: "p2",
    name: "Digital Blood Pressure Monitor",
    price: "₦15,000",
    description: "Automatic arm cuff with LCD display.",
    fullDescription: "Clinically validated accuracy for home blood pressure monitoring. Features irregular heartbeat detection and memory for up to 2 users.",
    dosage: "Use as directed by physician. Recommend checking twice daily.",
    ingredients: "N/A (Medical Device)",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7l1gGdL1ek5BOZXXQFTx9kfQGe8zDqTzRQY0cRoddYJbiE1WVOuN9xvW3tn5AdJ46R0K0-aNEo06IfUvmAU82KkAunzKI35h3hijOlAegI85LvaaBCQh2x9dAtZ8-5AiTF9gmiaY-GSpR03j2OWvJTbv1R8WEwmoLphwpLl2nX5_xihoZWqZOqhblFeROv_C4DJPW7D3IvVi7yi_FYNPhw44pfma84XFgXx5Xmmoa7kVgQguhksCXHf-dd1YB1mGufM-CoQGKz6Y",
    paystackLink: "https://paystack.com/buy/simulated-link-2",
    badge: null,
    category: "Devices"
  },
  {
    id: "p3",
    name: "Gentle Skin Cleanser",
    price: "₦8,200",
    description: "For sensitive and dry skin types.",
    fullDescription: "A dermatologist-backed formula that cleanses without stripping skin of its natural oils. Fragrance-free and non-comedogenic.",
    dosage: "Apply to wet skin, massage gently, and rinse.",
    ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Sodium Lauryl Sulfate.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDskFpcCH-yAnKJUNcbawJoCg5t-l78EiJMzOhujnTgNGx3xAVpNvdJprWkL_zjhPbynfWuLxvEi1NVD_TMJzzRvC-V0sxzEIw7IAd1_3tauVnRbaDk6K3TZuEJuexobRkaEtW2c-PzCEhiPgyDJv4LE0ZAUvCVirldSv1c_bwWzcN4DL8qL7nIcrQzfvG4Cbuh5j4TlNIXeI1pOv4f03-jJXfVZSa_yC2FJLR1HFFx05TFftvzhJYsQPWI57sTCV2c0_VebaoXpH8",
    paystackLink: "https://paystack.com/buy/simulated-link-3",
    badge: "Trending",
    category: "Skincare"
  },
  {
    id: "p4",
    name: "Baby Diapers (Size 3)",
    price: "₦5,500",
    description: "Super absorbent, pack of 50.",
    fullDescription: "Designed for active babies. Features 12-hour leak protection and a wetness indicator.",
    dosage: "Change as needed.",
    ingredients: "Cotton-like soft material, absorbent polymer core.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7aga9lq3vBKN5KqEzdWSnxcKFRozCBjzyf_KDy2iKZsp6PqSrhmDSXUp1wsTj8mhY2cEt2gtshMpF_3eOo6PEG4rLi319KW6vTs6QejPNlvBv1lkHKsjcT5GRHi3f_eocRXVPr_vbJUt97XLFT5eJQa66xLuVMfwlRIiBxP76ck13IQbBFOfA2UK174W7FSWqQACB6AcC3-rt_9kj9YurflW8Io8MSW_HeLdyYaTVrpQbf_EX-qgQwjNdwxyQqulDwnz7YtsA4M",
    paystackLink: "https://paystack.com/buy/simulated-link-4",
    badge: null,
    category: "Mother & Child"
  },
];

const CATEGORIES = [
  { name: "Prescriptions", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7GoUTknrZ2QyLyfyC8tUfJIF3MdlkKFyGzRNsQgY6_ur_6ntGpvLrNThPlEjBKTxfLVB_4T5sGbLlTJClGYLcdGWRct0bAPMw0gxPX2jhttP4t45f5o1ZKG1wXS_I2Q6XhfrbNh0wVpgAvi959tIlG6UwYS9kXa_1AGpO_R9WUgxi1sTZdeE7dzK7XlW52xl-91fFb_GMB5CMAcohiS5Ky-kv_afBKB6ts6j3KKjC_L2U16p1oTHwvP1bSy_IdpiTKYGUKTcSpo" },
  { name: "Mother & Child", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzMf5AgD97UDLpGs9PmWZH-NZl2iicg5pbuWBopo2af_OHg9PgbqcBSKyOXg6YYsmfP42I0GMcG-yqt9bu1w-gebcLiKuVTHe3NjVL-QwcrkcliCHJO4i6dn_hqj_lCqtAXxQIxg0d92Zmq11G_Dw7SgqEWgFbTjFPJ_W0C3MdHVuivTmF47mWKOd2WtKY3KDhuRK2RzlLVR5fewiwa2OKK51iGQhZEPfXuvUAkAG1DQpkvGpj0vZVnCVyBaoNs7Zg2LyB3nBDugw" },
  { name: "First Aid", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhtLMCMDgs_3s4IVarJeZ9veadkI3Z0AYK2KPcs_ieE2Gz782sBNhmxmltMHKSpV0iIE5Or2uO5CXSeJs8KwhdBz0R-pwczMOg1c1ihp9x8YTMNzUQe7FWRI_lWZocxVysJ1ztTXN2QM613UluESKA-U-VPYFjUayASw9go4tLQ3RDZYwQP3pxx4pTxyflXHnjSkkhdytmizTdQFpL26mEVWD5E8JLDFq7PxVp4JUtHHlHEF8ouwtry5aLgTGyKZJRoeldofxNHW4" },
  { name: "Wellness", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZnwAfFFQteL1sgzDGw8WCS3YsS6TjBFAKIr2x-55yVUu-vUdQxMuyzNFS8YWO6dBpzL5c4Mj353pEJNYMO2-ek0grWWe5u32dHRXiVcMGgYUfI-3M0PDJ-xuwct9zlpjPr9YEUqLxtC5AJgx3nh1lTZ26HBNKFNtzoY8258HLiBjxZXMmBOhcaIf0_yNzJ1dGnwIho2cOOWi0kIqztQT2hHOU9L2ujWi9D9sNWrwR-I_dmcWp2AOTt_VaocnDCiCpm7ICanzNJ9I" },
  { name: "Skincare", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFiu1R_p85DYJJU28cCV_HQSOAo0utUBqwDJQYDkO8fWwCAk2801aml6nrmJBw6D-x0K1NzJwnNkniV3bNNr9_xskJJuoyz9dxrkTJVuJLoe1Ci374rBM5pb-F3bAVw87gDbBm1jmElYJdKyh49lKjjxw3gA6wdDedlfg5nmIL66isSyS5MAwRYYJWWJ7fJk4T9ljfhNUgo4XgS-gsooptWg5ml-NPs4cIAbSlyq_1MXmb-xcDYis7HxKzDZNH0AL_tJMuemha-ew" },
  { name: "Devices", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGcRXqG0XD-w741oTnv_N83t1yBTbEjE1zs5BrU9RxzN5SqfayOKQhC65Dd3mgDwXRVt2u1vByIelCza6Jrjsmqm_GEgiAB_GgLXIgMxsdw_iyUWgMfCF1Ror-Ql_MXZgE7x0-Ye-Q2zxLzHUSdDn6KsJSNKvQGVDIoIAWmGuNCSMoF-Y_RTU0OoHgL79cp_NwwedpSplLkLIRPkbdutp99_veWJHqBIJgUxY8_TBwjRhkQLKFUowWfevSAd-w3uwTcni-qSrftZo" },
];

const ARTICLES = [
  {
    id: 1,
    tag: "Heart Health",
    title: "Top 5 Foods for a Healthier Heart",
    author: "Dr. A. B. Cole",
    date: "October 26, 2023",
    readTime: "4 min read",
    content: "Maintaining a healthy heart is crucial for longevity. In this article, we explore the best foods to include in your diet...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXBFuaRo8_wv_DKIUj0btOCGGfVqW-ShwSK2Y-5Pc_GantMOuSxZ2V9Lapv_Cz2N29PS2wO53pQoW7nrm_a2kTzuQ4DIHvxEAWO5GUKam_F3hFSMMw_tH0xyM5qE5SD4mUBM1W3re5WzMF_cfH5erPvz3jUPvFC-8O2YaW0oZbIe_wVtRTI2iuUmTmyzTQqnRpwVLJtziYoY0opSXf_jFK1sPMUBvDjPB6WN3tWzF3pLh4DAja6fi2agQ6Nc_DvpUq69LAJ7YBEFQ",
  },
  {
    id: 2,
    tag: "Wellness",
    title: "The Importance of a Good Night's Sleep",
    author: "Pharm. Chioma",
    date: "October 22, 2023",
    readTime: "3 min read",
    content: "Sleep is the body's natural healer. Without adequate rest, your immune system weakens. Learn how to improve your sleep hygiene...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaPeKGk1QRCwQAwqt-YoLm_RxpQ97G2fS58fdPjzuJKbjS-Sk48r5QTqp0CGC6IPy9q21t6M5qY6mK1QOo_7X6kGafanoIXq_hz-ItZnYqFh2orwkLMAMgVbilPUCz3MIlLU9z5jZbDRwmaHpRjfHjd6eO2MAqLsoceTkNz_KCONhK3P6lD2p_r_zMZ_4wVS0k7eyLwSIw4M5QfkD_woCsK6i_5PybfD5L69cgHVYbm3aghD4HWYw2vzMQEQO6eEKFYi_PYrze2T0",
  },
  {
    id: 3,
    tag: "Nutrition",
    title: "Easy Meal Prep Ideas for a Busy Week",
    author: "Nutritionist Sarah",
    date: "October 19, 2023",
    readTime: "5 min read",
    content: "Meal prepping saves time and ensures you eat healthy. Here are 5 easy recipes you can prepare on Sunday for the whole week...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuChWjBcrurUF1ZL6XpvN89s2HEdxGzHrSXJYHEPkqADrmWyrSEMKrIq5o__MeH1MMkOLiXPtBNsI5HUqcCoYgkVjxgEiY7jxumRhKluwREgDPwWRky6qIkXRUaghuenBbBwxwTX-EmkmJX-GMx85jFAoVfrodJ4ym3yZeqAxDRPcAT3bS5mFJO_V60pPFzZpPu7SCLziSfvunb1u2bDj9nFuMDYodKpVyvoWKtiUBb5As5vJA2UOS5KrE_aT1I6rN3jzpMfkgBEJh0",
  },
  {
    id: 4,
    tag: "Heart Health",
    title: "Understanding Cholesterol Levels",
    author: "Dr. A. B. Cole",
    date: "October 15, 2023",
    readTime: "6 min read",
    content: "Cholesterol isn't all bad. It's essential for building cells. However, high levels of LDL can lead to heart disease. Let's break down the numbers...",
    img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=2070",
  },
];

const OUTREACH_GALLERY = [
  { id: 1, src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070", caption: "Free Malaria Testing Drive", size: "large" },
  { id: 2, src: "https://images.unsplash.com/photo-1584515933487-9d900da67353?auto=format&fit=crop&q=80&w=1000", caption: "Pediatric Consultation", size: "small" },
  { id: 3, src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000", caption: "Community Health Talk", size: "small" },
  { id: 4, src: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1000", caption: "Blood Pressure Checks", size: "wide" },
];

// --- Components ---

// 1. Feedback Widget (Client Feedback Tool)
const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          Share Feedback
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72 animate-scale-up origin-bottom-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Feedback / Comments</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {sent ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-center text-sm font-medium">
              Thank you! We've received your feedback.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-primary mb-3 text-gray-800 dark:text-white resize-none"
                rows={3}
                placeholder="What do you think about this page?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

// 2. SEO Schema Engine (Invisible but critical for rankings)
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

// 3. Search Overlay (Instant Find)
const SearchOverlay = ({ isOpen, onClose, onProductClick, onArticleClick }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredProducts = query
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredArticles = query
    ? ARTICLES.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 dark:bg-gray-900/98 backdrop-blur-xl transition-all duration-300 animate-fade-in flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 pt-8">
        <div className="flex items-center gap-4 border-b-2 border-gray-200 dark:border-gray-700 pb-4">
          <span className="material-symbols-outlined text-gray-400 text-3xl">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for medicine, health tips..."
            className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-gray-500 text-2xl">close</span>
          </button>
        </div>

        <div className="mt-8 overflow-y-auto max-h-[80vh] pb-12">
          {!query && (
            <div className="text-center py-20 opacity-50">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">manage_search</span>
              <p className="text-lg text-gray-500">Start typing to find products or health advice instantly.</p>
            </div>
          )}

          {query && filteredProducts.length === 0 && filteredArticles.length === 0 && (
            <p className="text-center text-gray-500 py-10">No results found for "{query}".</p>
          )}

          {filteredProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onClose();
                      onProductClick(product);
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 w-full text-left"
                  >
                    <img src={product.img} alt={product.name} className="w-16 h-16 object-contain mix-blend-multiply dark:mix-blend-normal bg-white rounded-md p-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h4>
                      <p className="text-sm text-primary font-medium">{product.price}</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-300 group-hover:text-primary">visibility</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredArticles.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Health Hub</h3>
              <div className="space-y-3">
                {filteredArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => {
                      onClose();
                      onArticleClick(article);
                    }}
                    className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 w-full text-left"
                  >
                    <span className="text-xs font-bold text-accent-red mb-1 block">{article.tag}</span>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{article.title}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Article Modal (Reader View)
const ArticleModal = ({ article, isOpen, onClose }) => {
  if (!isOpen || !article) return null;

  // Simulate cross-selling
  const relatedProduct = PRODUCTS.find(p => p.category === article.tag) || PRODUCTS[0];

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-0 md:p-4">
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-gray-800 dark:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto max-h-[100vh] md:max-h-[90vh]">
            <div className="h-64 md:h-80 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${article.img}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-accent-red text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{article.tag}</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">{article.title}</h2>
                <div className="flex items-center gap-3 mt-4 text-gray-300 text-sm">
                  <span>By {article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {article.content}
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3 text-primary dark:text-white">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Consistent routine is key.</li>
                  <li>Hydration plays a major role in overall health.</li>
                  <li>Consult a pharmacist before starting new supplements.</li>
                </ul>
                <p className="mt-6 text-gray-600 dark:text-gray-400">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>

              {/* Simulated Share Section */}
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase">Share this article</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"><span className="material-symbols-outlined text-[18px]">share</span></button>
                  <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><span className="material-symbols-outlined text-[18px]">bookmark</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Related Product (The "Funnel") */}
          <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800/50 border-l border-gray-100 dark:border-gray-800 p-6 hidden md:flex flex-col">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Related Product</h3>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 text-center">
              <img src={relatedProduct.img} className="w-32 h-32 mx-auto object-contain mb-4 mix-blend-multiply dark:mix-blend-normal" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{relatedProduct.name}</h4>
              <p className="text-primary font-bold mb-4">{relatedProduct.price}</p>
              <a href={relatedProduct.paystackLink} target="_blank" className="block w-full bg-accent-red text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
                Buy Now
              </a>
            </div>

            <div className="mt-auto bg-primary/10 rounded-xl p-4">
              <p className="text-sm text-primary font-medium mb-2">Need professional advice?</p>
              <button className="text-xs font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                Chat with Pharmacist <span className="material-symbols-outlined text-[14px]">chat</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// 5. Product Modal (Quick View)
const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative min-h-screen md:min-h-0 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">

          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Image Side */}
          <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center">
            <img src={product.img} alt={product.name} className="w-full max-w-sm h-auto object-contain mix-blend-multiply dark:mix-blend-normal transform hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Details Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col h-full overflow-y-auto max-h-[80vh]">
            <div className="mb-1">
              <span className="text-accent-red font-bold text-xs uppercase tracking-wider">{product.category || "Pharmacy"}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-primary dark:text-primary">{product.price}</span>
              {product.badge && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">{product.badge}</span>}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {product.fullDescription || product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">medication</span> Dosage
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.dosage || "Consult a physician."}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">science</span> Ingredients
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.ingredients || "See package."}</p>
              </div>
            </div>

            <div className="mt-auto">
              <a
                href={product.paystackLink}
                target="_blank"
                className="w-full block bg-accent-red text-white text-center font-bold py-4 rounded-xl hover:bg-red-700 transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                Proceed to Checkout on Paystack
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                <span className="material-symbols-outlined text-[12px] align-middle">lock</span> Secure transaction processed by Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Outreach Gallery (Brand Trust)
const OutreachGallery = () => {
  return (
    <div className="py-16 bg-gray-50 dark:bg-[#0c0b1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">Our Impact</span>
          <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-4">
            Medomni in the Community
          </h2>
          <p className="text-gray-500">
            We are more than a pharmacy. We are a community partner committed to improving public health through education and free checkups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {OUTREACH_GALLERY.map((item, idx) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-2xl ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                  item.size === 'wide' ? 'md:col-span-2' : ''
                }`}
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${item.src}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="text-primary dark:text-white font-semibold hover:underline inline-flex items-center gap-1">
            View Full Gallery <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timeoutRef = useRef(null);

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isPaused]);

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  // Swipe handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {CAROUSEL_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className={`max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-${slide.align}`}>
              <div className={`max-w-2xl ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto' : ''}`}>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium drop-shadow-md">
                  {slide.subtitle}
                </p>
                <button className="bg-accent-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg border-2 border-transparent hover:border-white/20">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        aria-label="Previous Slide"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        aria-label="Next Slide"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {CAROUSEL_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-accent-red w-8"
                : "bg-white/50 hover:bg-white/80 w-2"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onQuickView }) => {
  const handleGatewayClick = (e) => {
    // Gateway Logic: Track conversion before redirect
    console.log(`[Gateway Analytics] User initiating redirect for Product: ${product.id}`);
    // In production, fire GTM/Analytics event here
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 dark:hover:border-gray-700 h-full">
      <div
        className="relative w-full h-56 bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {product.badge}
          </span>
        )}
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain p-4 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
          style={{ backgroundImage: `url('${product.img}')` }}
        ></div>

        {/* Quick Overlay Action */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
          <span className="bg-white/90 text-gray-900 text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Quick View
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 cursor-pointer" onClick={() => onQuickView(product)}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xl font-bold text-primary dark:text-white">
            {product.price}
          </span>
          {/* Gateway Action: Deep Link to Paystack */}
          <a
            href={product.paystackLink}
            onClick={handleGatewayClick}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-accent-red text-white text-sm font-bold py-2.5 px-4 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-1 hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
          >
            <span>Buy Now</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const HealthHub = ({ onArticleClick }) => {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Heart Health", "Wellness", "Nutrition"];

  const filteredArticles = activeTab === "All"
    ? ARTICLES
    : ARTICLES.filter(article => article.tag === activeTab);

  return (
    <div className="py-16 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">The Blog</span>
            <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-2">
              The Health Hub
            </h2>
            <p className="text-gray-500">
              Expert advice, wellness tips, and pharmacy updates.
            </p>
          </div>

          {/* CMS Categories Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeTab === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-full h-48 overflow-hidden relative">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${article.img}')` }}
                ></div>
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-800 dark:text-white shadow-sm">
                  {article.tag}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary transition-colors mb-3 leading-snug">
                  {article.title}
                </h3>
                <span className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:text-accent-red transition-colors group/link">
                  Read Article <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setStatus("success");
      setEmail("");
      // Simulate API call
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="bg-primary py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the Medomni Community</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">Subscribe for exclusive health tips, early access to outreach programs, and special discount codes.</p>

        {status === "success" ? (
          <div className="bg-green-500/20 backdrop-blur border border-green-500 text-white px-6 py-4 rounded-xl inline-block animate-fade-in-up">
            <span className="font-bold flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> You are subscribed!</span>
          </div>
        ) : (
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-full px-6 py-3 border-0 focus:ring-2 focus:ring-accent-red text-gray-900 shadow-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="bg-accent-red text-white font-bold rounded-full px-8 py-3 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isSearchOpen || selectedProduct || selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isSearchOpen, selectedProduct, selectedArticle]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-sans">
      <SeoEngine />
      <FeedbackWidget />

      {/* Modals */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductClick={setSelectedProduct}
        onArticleClick={setSelectedArticle}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Top Banner - Utility */}
      <div className="w-full bg-primary dark:bg-background-dark border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1.5">
          <p className="text-white/80 text-xs font-medium tracking-wide">
            Trusted by 10,000+ Customers across Nigeria
          </p>
          <div className="hidden sm:flex gap-4">
            <a href="#" className="text-white/80 hover:text-white text-xs transition-colors">Track Order</a>
            <a href="#" className="text-white/80 hover:text-white text-xs transition-colors">Help Center</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section - UPDATED to use Image */}
            <div className="flex items-center gap-3">
              <img
                src="logo.png"
                alt="Medomni Pharmacy"
                className="h-12 md:h-16 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Fallback if image fails - shows text
                  e.currentTarget.nextElementSibling.classList.remove('hidden');
                }}
              />
              <div className="hidden"> {/* Fallback container */}
                <span className="text-xl font-bold text-primary">MEDOMNI PHARMACY</span>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {["Shop", "Outreach", "Health Hub", "About Us"].map(
                (item) => (
                  <a
                    key={item}
                    className="text-gray-700 dark:text-gray-200 text-sm font-semibold hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-wide relative group"
                    href="#"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden text-gray-700 dark:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>

            {/* Search - Compact */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
              {/* Cart removed as per Gateway Strategy, simple User Acct remains */}
              <button className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 animate-fade-in-down shadow-xl z-40">
            <nav className="flex flex-col px-4 py-6 gap-4">
              {["Shop", "Outreach", "Health Hub", "About Us"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span> Search
                </button>
                <button className="flex-1 bg-primary text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">person</span> Account
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Dynamic Campaign Carousel - Replaces Static Hero */}
        <HeroCarousel />

        {/* Shop by Category */}
        <div className="py-16 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight">
                Browse Departments
              </h2>
              <p className="mt-2 text-gray-500">Find exactly what you need for you and your family.</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {CATEGORIES.map((category) => (
                <a
                  href="#"
                  key={category.name}
                  className="group flex flex-col items-center gap-3 text-center cursor-pointer"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-800 group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md bg-white">
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url('${category.img}')` }}
                    ></div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products - Gateway Mode */}
        <div className="py-20 bg-background-light dark:bg-background-dark/50 border-t border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight">
                  Best Sellers
                </h2>
                <p className="mt-1 text-gray-500">Customer favorites available for immediate delivery via Paystack.</p>
              </div>
              <a href="#" className="hidden sm:flex items-center text-accent-red font-semibold hover:text-red-700 transition-colors">
                View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <a href="#" className="text-accent-red font-semibold hover:text-red-700 inline-flex items-center">
                View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Outreach Gallery - Phase 2 New Section */}
        <OutreachGallery />

        {/* Health Hub - SEO Engine with Tabs */}
        <HealthHub onArticleClick={setSelectedArticle} />

        {/* Newsletter / Lead Magnet - Functional */}
        <Newsletter />

        {/* Store Info - Milestone 2 */}
        <StoreInfoSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="logo.png"
                  alt="Medomni Pharmacy"
                  className="h-10 w-auto object-contain bg-white/10 rounded p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.classList.remove('hidden');
                  }}
                />
                <div className="text-white hidden"> {/* Fallback */}
                  <span className="text-xl font-bold">MEDOMNI</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Where your healthcare needs dominates. Quality pharmaceuticals delivered to your doorstep.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Shop</h3>
              <ul className="mt-4 space-y-2">
                {["Prescriptions", "Vitamins", "Personal Care", "Devices"].map(
                  (link) => (
                    <li key={link}>
                      <a className="text-gray-400 hover:text-white transition-colors text-sm" href="#">
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Support</h3>
              <ul className="mt-4 space-y-2">
                {["Contact Us", "Shipping Policy", "Return Policy", "FAQs"].map((link) => (
                  <li key={link}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Legal</h3>
              <ul className="mt-4 space-y-2">
                {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link) => (
                  <li key={link}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2023 Medomni Pharmacy. All Rights Reserved.</p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">public</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">share</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Action Button */}
      <a
        className="fixed bottom-6 right-6 z-50 group"
        href="https://wa.me/2340000000000"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="bg-[#25D366] text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:scale-110">
          <svg
            aria-hidden="true"
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.55C8.76 21.36 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.91C20.28 16.43 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.74 7.91 19L7.31 18.66L4.2 19.56L5.12 16.55L4.85 15.93C4.1 14.63 3.79 13.25 3.79 11.91C3.79 7.39 7.52 3.67 12.04 3.67M9.13 7.5C8.91 7.5 8.7 7.43 8.53 7.64C8.36 7.85 7.82 8.41 7.82 9.44C7.82 10.47 8.55 11.45 8.68 11.62C8.8 11.79 10.16 14.12 12.55 15.06C14.54 15.84 14.95 15.68 15.34 15.63C15.82 15.56 16.68 15.03 16.89 14.43C17.1 13.82 17.1 13.33 17.03 13.22C16.95 13.11 16.78 13.04 16.51 12.91C16.24 12.77 14.95 12.13 14.71 12.03C14.47 11.93 14.3 11.89 14.14 12.13C13.97 12.38 13.43 13.01 13.27 13.2C13.11 13.38 12.94 13.41 12.67 13.28C12.4 13.14 11.57 12.87 10.55 11.99C9.75 11.28 9.21 10.43 9.04 10.16C8.87 9.89 9.01 9.75 9.15 9.61C9.28 9.49 9.43 9.3 9.56 9.15C9.68 9.01 9.75 8.87 9.88 8.64C10 8.41 9.94 8.23 9.87 8.11C9.8 7.99 9.36 6.84 9.13 7.5Z"></path>
          </svg>
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2">
            Chat with Pharmacist
          </span>
        </div>
      </a>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);