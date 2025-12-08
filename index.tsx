import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { AuthModal, UserMenu } from "./src/components/auth";

// Pages
import HomePage from "./src/pages/HomePage";
import PrivacyPolicy from "./src/pages/PrivacyPolicy";
import TermsOfService from "./src/pages/TermsOfService";
import ReturnPolicy from "./src/pages/ReturnPolicy";
import ShippingPolicy from "./src/pages/ShippingPolicy";
import ContactUs from "./src/pages/ContactUs";

// Components
import SocialFABs from "./src/components/features/SocialFABs";
import ProductCard from "./src/components/ProductCard";

// Data
import { PRODUCTS } from "./src/data/products";
import { ARTICLES } from "./src/data/articles";
import { CAROUSEL_SLIDES } from "./src/data/carouselSlides";

// --- Components ---

// 1. Feedback Widget (Client Feedback Tool)
const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
const SearchOverlay = ({ isOpen, onClose, onProductClick, onArticleClick }: any) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
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
const ArticleModal = ({ article, isOpen, onClose }: any) => {
  const { isAuthenticated } = useAuth();
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
              <div className="prose dark:prose-invert max-w-none relative">
                {article.isGated && !isAuthenticated ? (
                  <>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 blur-sm select-none">
                      {article.content.substring(0, 150)}...
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] z-10 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-accent-red mb-4">lock</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Member Only Content</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                        Sign in to read this full article and access exclusive health tips.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          const event = new CustomEvent('open-auth-modal');
                          window.dispatchEvent(event);
                        }}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        Sign In to Read
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
const ProductModal = ({ product, isOpen, onClose }: any) => {
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

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
      <ScrollToTop />
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
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="logo.png"
                alt="Medomni Pharmacy"
                className="h-12 md:h-16 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Fallback if image fails - shows text
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden"> {/* Fallback container */}
                <span className="text-xl font-bold text-primary">MEDOMNI PHARMACY</span>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 dark:text-gray-200 text-sm font-semibold hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-wide relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-200 text-sm font-semibold hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-wide relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {/* Other links can be added here */}
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
              {/* User Auth - Milestone 6 */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 animate-fade-in-down shadow-xl z-40">
            <nav className="flex flex-col px-4 py-6 gap-4">
              <Link
                to="/"
                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
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
        <Routes>
          <Route path="/" element={<HomePage onProductClick={setSelectedProduct} onArticleClick={setSelectedArticle} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
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
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
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
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
                <li><Link to="/return-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Return Policy</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2023 Medomni Pharmacy. All Rights Reserved.</p>
            <div className="flex gap-4">
              {/* Social Media Icons */}
              <a
                href="https://instagram.com/medomnipharmacy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all duration-300 group"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://snapchat.com/add/medomnipharmacy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FFFC00] hover:text-black transition-all duration-300"
                title="Add us on Snapchat"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.394.394 0 0 1 .464.049c.125.12.179.3.146.472-.024.126-.282 1.107-1.771 1.107-.202 0-.398-.021-.571-.054-.132-.025-.251-.043-.355-.043-.211 0-.345.056-.424.161-.092.11-.101.239-.094.298.016.165.082.303.295.532l.058.061c.586.64 1.235 1.358 1.235 2.347 0 1.56-2.083 3.45-6.592 3.45-4.511 0-6.594-1.89-6.594-3.45 0-.979.64-1.696 1.226-2.337l.068-.072c.214-.229.28-.366.296-.532.007-.059-.002-.188-.094-.298-.079-.105-.213-.161-.424-.161-.104 0-.223.018-.355.043-.173.033-.369.054-.571.054-1.489 0-1.747-.981-1.771-1.107-.033-.172.021-.352.146-.472a.395.395 0 0 1 .464-.049c.374.181.733.285 1.033.301.198 0 .326-.045.401-.09a6.62 6.62 0 0 1-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847 1.583-3.545 4.94-3.821 5.93-3.821h.393z" />
                </svg>
              </a>
              <a
                href="https://wa.me/2347052350000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.55C8.76 21.36 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.91C20.28 16.43 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.74 7.91 19L7.31 18.66L4.2 19.56L5.12 16.55L4.85 15.93C4.1 14.63 3.79 13.25 3.79 11.91C3.79 7.39 7.52 3.67 12.04 3.67"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal - Milestone 6 */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Social Media FABs - Milestone 4 */}
      <SocialFABs />
    </div>
  );
};

// Wrapper component to provide AuthProvider and Router
const AppWithAuth = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppWithAuth />);
