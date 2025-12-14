import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { WishlistProvider } from "./src/contexts/WishlistContext";
import { AuthModal } from "./src/components/auth";

// Pages
import HomePage from "./src/pages/HomePage";
import ProductsPage from "./src/pages/ProductsPage";
import PrivacyPolicy from "./src/pages/PrivacyPolicy";
import TermsOfService from "./src/pages/TermsOfService";
import ReturnPolicy from "./src/pages/ReturnPolicy";
import ShippingPolicy from "./src/pages/ShippingPolicy";
import ContactUs from "./src/pages/ContactUs";
import ServicesPage from "./src/pages/ServicesPage";
import FAQsPage from "./src/pages/FAQsPage";

// Admin Pages
import AdminDashboard from "./src/pages/admin/AdminDashboard";
import CarouselManager from "./src/pages/admin/CarouselManager";
import CategoryManager from "./src/pages/admin/CategoryManager";
import ProductManager from "./src/pages/admin/ProductManager";
import AppointmentManager from "./src/pages/admin/AppointmentManager";
import FeedbackManager from "./src/pages/admin/FeedbackManager";
import ArticleManager from "./src/pages/admin/ArticleManager";
import GalleryManager from "./src/pages/admin/GalleryManager";
import SubscriberManager from "./src/pages/admin/SubscriberManager";
import AdminRoute from "./src/components/auth/AdminRoute";

// Components
import SocialFABs from "./src/components/features/SocialFABs";
import FeedbackWidget from "./src/components/features/FeedbackWidget";
import SeoEngine from "./src/components/features/SeoEngine";
import SearchOverlay from "./src/components/features/SearchOverlay";
import ArticleModal from "./src/components/features/ArticleModal";
import ProductModal from "./src/components/features/ProductModal";
import ScrollToTop from "./src/components/utils/ScrollToTop";
import Layout from "./src/components/layout/Layout";

const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isSearchOpen || selectedProduct || selectedArticle || isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isSearchOpen, selectedProduct, selectedArticle, isAuthModalOpen]);

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

      {/* Layout wraps Header, Main Content, and Footer */}
      <Layout
        onSearchOpen={() => setIsSearchOpen(true)}
        onAuthModalOpen={() => setIsAuthModalOpen(true)}
      >
        <Routes>
          <Route path="/" element={<HomePage onProductClick={setSelectedProduct} onArticleClick={setSelectedArticle} />} />
          <Route path="/shop" element={<ProductsPage onProductClick={setSelectedProduct} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/faqs" element={<FAQsPage />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="carousel" element={<CarouselManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="appointments" element={<AppointmentManager />} />
            <Route path="feedback" element={<FeedbackManager />} />
            <Route path="articles" element={<ArticleManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="subscribers" element={<SubscriberManager />} />
          </Route>
        </Routes>
      </Layout>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Social Media FABs */}
      <SocialFABs />
    </div>
  );
};

// Wrapper component to provide AuthProvider, ToastProvider, WishlistProvider, and Router
const AppWithAuth = () => (
  <AuthProvider>
    <ToastProvider>
      <WishlistProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WishlistProvider>
    </ToastProvider>
  </AuthProvider>
);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppWithAuth />);
