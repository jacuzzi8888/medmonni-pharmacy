import React, { useState, useEffect, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { WishlistProvider } from "./src/contexts/WishlistContext";
import { AuthModal } from "./src/components/auth";
import { ErrorBoundary } from "./src/components/common";

// Pages - Core pages loaded immediately
import HomePage from "./src/pages/HomePage";
import ProductsPage from "./src/pages/ProductsPage";
import ContactUs from "./src/pages/ContactUs";
import ServicesPage from "./src/pages/ServicesPage";
import NotFoundPage from "./src/pages/NotFoundPage";

// Pages - Policy pages lazy loaded (rarely visited)
const PrivacyPolicy = React.lazy(() => import("./src/pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./src/pages/TermsOfService"));
const ReturnPolicy = React.lazy(() => import("./src/pages/ReturnPolicy"));
const ShippingPolicy = React.lazy(() => import("./src/pages/ShippingPolicy"));
const FAQsPage = React.lazy(() => import("./src/pages/FAQsPage"));
const AboutPage = React.lazy(() => import("./src/pages/AboutPage"));
const HealthTipsPage = React.lazy(() => import("./src/pages/HealthTipsPage"));

// Admin Pages - Lazy loaded (only ~10% of users need these)
const AdminDashboard = React.lazy(() => import("./src/pages/admin/AdminDashboard"));
const CarouselManager = React.lazy(() => import("./src/pages/admin/CarouselManager"));
const CategoryManager = React.lazy(() => import("./src/pages/admin/CategoryManager"));
const ProductManager = React.lazy(() => import("./src/pages/admin/ProductManager"));
const AppointmentManager = React.lazy(() => import("./src/pages/admin/AppointmentManager"));
const FeedbackManager = React.lazy(() => import("./src/pages/admin/FeedbackManager"));
const ArticleManager = React.lazy(() => import("./src/pages/admin/ArticleManager"));
const GalleryManager = React.lazy(() => import("./src/pages/admin/GalleryManager"));
const SubscriberManager = React.lazy(() => import("./src/pages/admin/SubscriberManager"));
const AboutManager = React.lazy(() => import("./src/pages/admin/AboutManager"));
import AdminRoute from "./src/components/auth/AdminRoute";

// Components
import SocialFABs from "./src/components/features/SocialFABs";
// import FeedbackWidget from "./src/components/features/FeedbackWidget"; // Disabled for now
import SeoEngine from "./src/components/features/SeoEngine";
import SearchOverlay from "./src/components/features/SearchOverlay";
import ArticleModal from "./src/components/features/ArticleModal";
import ProductModal from "./src/components/features/ProductModal";
import WelcomePopup from "./src/components/features/WelcomePopup";
import ScrollToTop from "./src/components/utils/ScrollToTop";
import Layout from "./src/components/layout/Layout";
import ProfileLayout from "./src/components/profile/ProfileLayout";
import ProfileDetails from "./src/components/profile/ProfileDetails";
import SecuritySettings from "./src/components/profile/SecuritySettings";
import NotificationPreferences from "./src/components/profile/NotificationPreferences";
import AddressBook from "./src/components/profile/AddressBook";
import OrderHistory from "./src/components/profile/OrderHistory";
import SavedItems from "./src/components/profile/SavedItems";

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
);

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

  // Listen for open-auth-modal custom event (from locked articles)
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-sans">
      <ScrollToTop />
      <SeoEngine />
      {/* <FeedbackWidget /> - Disabled for now */}

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

      {/* Routes - Admin routes are separate from Layout */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin Routes - Protected, uses AdminLayout internally */}
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
            <Route path="about" element={<AboutManager />} />
          </Route>

          {/* Public Routes - Wrapped in Layout with Header/Footer */}
          <Route path="/*" element={
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
                <Route path="/about" element={<AboutPage />} />
                <Route path="/health-tips" element={<HealthTipsPage />} />

                {/* Profile Routes */}
                <Route path="/profile" element={<ProfileLayout />}>
                  <Route index element={<ProfileDetails />} />
                  <Route path="details" element={<ProfileDetails />} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="addresses" element={<AddressBook />} />
                  <Route path="saved" element={<SavedItems />} />
                  <Route path="security" element={<SecuritySettings />} />
                  <Route path="preferences" element={<NotificationPreferences />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Welcome Popup for first-time visitors */}
      <WelcomePopup onSignUp={() => setIsAuthModalOpen(true)} />

      {/* Social Media FABs */}
      <SocialFABs />
    </div>
  );
};

// Wrapper component to provide AuthProvider, ToastProvider, WishlistProvider, and Router
const AppWithAuth = () => (
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <WishlistProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppWithAuth />);
