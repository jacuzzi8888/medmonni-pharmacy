import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserMenu } from "../auth";
import { supabase } from "../../lib/supabase";

interface LayoutProps {
    children: React.ReactNode;
    onSearchOpen: () => void;
    onAuthModalOpen: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearchOpen, onAuthModalOpen }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, profile, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Track scroll position for header shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onSearchOpen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSearchOpen]);

    return (
        <>
            {/* Top Banner - Utility with Gradient */}
            <div className="w-full bg-gradient-to-r from-primary via-primary/95 to-primary dark:from-background-dark dark:via-background-dark dark:to-background-dark border-b border-white/10 relative z-50 overflow-hidden">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1.5">
                    <p className="text-white/90 text-xs font-medium tracking-wide flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="animate-shimmer bg-clip-text">
                            Trusted by 10,000+ Customers across Nigeria
                        </span>
                    </p>
                    <div className="hidden sm:flex gap-4 items-center">
                        <a href="tel:07052350000" className="text-white/80 hover:text-white text-xs transition-colors flex items-center gap-1.5 hover:gap-2">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            Call Us
                        </a>
                        <span className="text-white/30">|</span>
                        <a href="https://wa.me/2347052350000" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white text-xs transition-colors flex items-center gap-1.5 hover:gap-2">
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Header with Dynamic Shadow */}
            <header className={`sticky top-0 z-40 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Medomni Pharmacy"
                                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-12 md:h-16' : 'h-14 md:h-20'}`}
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
                        <nav className="hidden md:flex items-center gap-2">
                            <Link to="/shop" className="px-4 py-2 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all uppercase tracking-wide">
                                Shop
                            </Link>
                            <Link to="/services" className="px-4 py-2 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all uppercase tracking-wide">
                                Services
                            </Link>
                            <Link to="/health-tips" className="px-4 py-2 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all uppercase tracking-wide">
                                Health Hub
                            </Link>
                            <Link to="/about" className="px-4 py-2 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all uppercase tracking-wide">
                                About
                            </Link>
                            <Link to="/services#book-appointment" className="px-4 py-2 bg-accent-red text-white text-sm font-semibold hover:bg-red-700 rounded-full transition-all uppercase tracking-wide flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                Appointments
                            </Link>
                            <Link to="/contact" className="px-4 py-2 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all uppercase tracking-wide">
                                Contact
                            </Link>
                        </nav>

                        {/* Mobile Menu Icon */}
                        <button
                            className="md:hidden text-gray-700 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>

                        {/* Search & Auth - Desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Search Button - Styled Pill */}
                            <button
                                onClick={onSearchOpen}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-all group"
                            >
                                <span className="material-symbols-outlined text-[20px]">search</span>
                                <span className="text-sm hidden lg:inline">Search</span>
                                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-[10px] font-medium text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 ml-2">
                                    <span className="text-[10px]">⌘</span>K
                                </kbd>
                            </button>
                            {/* User Auth */}
                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <button
                                    onClick={onAuthModalOpen}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all text-sm btn-lift shimmer-overlay"
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
                            {/* User Section - AT THE TOP for logged in users */}
                            {isAuthenticated && (
                                <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                                    {/* User Info Card */}
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            {(profile?.full_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                    </Link>

                                    {/* Quick Profile Links */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <Link
                                            to="/profile/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex flex-col items-center gap-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">shopping_bag</span>
                                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Orders</span>
                                        </Link>
                                        <Link
                                            to="/profile/appointments"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex flex-col items-center gap-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">calendar_month</span>
                                            <span className="text-xs font-medium text-green-700 dark:text-green-300">Appointments</span>
                                        </Link>
                                        <Link
                                            to="/profile/saved"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex flex-col items-center gap-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">favorite</span>
                                            <span className="text-xs font-medium text-red-700 dark:text-red-300">Saved</span>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <Link
                                to="/shop"
                                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link
                                to="/services"
                                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                to="/health-tips"
                                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Health Hub
                            </Link>
                            <Link
                                to="/about"
                                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                to="/services#book-appointment"
                                className="flex items-center gap-2 text-lg font-medium text-accent-red py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                Book Appointment
                            </Link>
                            <Link
                                to="/contact"
                                className="text-lg font-medium text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            {/* Search Button */}
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); onSearchOpen(); }}
                                className="w-full bg-gray-100 dark:bg-gray-800 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">search</span> Search
                            </button>

                            {/* Bottom Section - Admin link and Sign Out for authenticated, Sign In for others */}
                            {isAuthenticated ? (
                                <div className="mt-2 space-y-3">
                                    {/* Admin Dashboard Link */}
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {/* Logout Button */}
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            localStorage.clear();
                                            sessionStorage.clear();
                                            supabase.auth.signOut().catch(console.error);
                                            setTimeout(() => { window.location.href = '/'; }, 100);
                                        }}
                                        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); onAuthModalOpen(); }}
                                    className="w-full bg-primary text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span> Sign In
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white relative overflow-hidden">
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-red to-primary" />

                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    src="/logo.png"
                                    alt="Medomni Pharmacy"
                                    className="h-12 w-auto object-contain bg-white/10 rounded p-1"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="text-white hidden"> {/* Fallback */}
                                    <span className="text-xl font-bold">MEDOMNI</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">Where your healthcare needs dominates. Quality pharmaceuticals delivered to your doorstep.</p>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                Lagos, Nigeria
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Shop</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">All Products<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Our Services<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Support</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Contact Us<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                                <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Shipping Policy<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                                <li><Link to="/return-policy" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Return Policy<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                                <li><Link to="/faqs" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">FAQs<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Terms of Service<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group">Privacy Policy<span className="material-symbols-outlined text-[12px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Medomni Pharmacy. All Rights Reserved.</p>
                        <div className="flex gap-3">
                            {/* Social Media Icons - Enhanced with animations */}
                            <a
                                href="https://instagram.com/medomnipharmacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6"
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
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FFFC00] hover:text-black transition-all duration-300 hover:scale-110 hover:rotate-6"
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
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6"
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
        </>
    );
};

export default Layout;
