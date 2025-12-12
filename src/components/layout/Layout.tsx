import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserMenu } from "../auth";

interface LayoutProps {
    children: React.ReactNode;
    onSearchOpen: () => void;
    onAuthModalOpen: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearchOpen, onAuthModalOpen }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <>
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
                                onClick={onSearchOpen}
                                className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            {/* User Auth */}
                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <button
                                    onClick={onAuthModalOpen}
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
                                    onClick={() => { setIsMobileMenuOpen(false); onSearchOpen(); }}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">search</span> Search
                                </button>
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); onAuthModalOpen(); }}
                                    className="flex-1 bg-primary text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span> Account
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
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
        </>
    );
};

export default Layout;
