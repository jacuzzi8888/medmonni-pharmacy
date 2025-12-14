import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { profile, signOut } = useAuth();

    const navigation = [
        { name: 'Dashboard', path: '/admin', icon: 'dashboard', badge: null },
        { name: 'Carousel', path: '/admin/carousel', icon: 'view_carousel', badge: null },
        { name: 'Categories', path: '/admin/categories', icon: 'category', badge: null },
        { name: 'Products', path: '/admin/products', icon: 'inventory_2', badge: null },
        { name: 'Articles', path: '/admin/articles', icon: 'article', badge: null },
        { name: 'Gallery', path: '/admin/gallery', icon: 'photo_library', badge: null },
        { name: 'Subscribers', path: '/admin/subscribers', icon: 'mail', badge: null },
        { name: 'Appointments', path: '/admin/appointments', icon: 'calendar_month', badge: null },
        { name: 'Feedback', path: '/admin/feedback', icon: 'forum', badge: null },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30">
                {/* Gradient accent line */}
                <div className="h-1 bg-gradient-to-r from-primary via-blue-600 to-accent-red" />

                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
                        </button>

                        {/* Logo */}
                        <Link to="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-lg text-gray-900 dark:text-white block leading-tight">
                                    Admin Panel
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Medomni Pharmacy</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Back to site */}
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">storefront</span>
                            View Site
                        </Link>

                        {/* User menu */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-red rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {(profile?.full_name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                    {profile?.full_name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {profile?.role?.replace('_', ' ') || 'admin'}
                                </p>
                            </div>
                            <button
                                onClick={signOut}
                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
                                title="Sign Out"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex pt-[68px]">
                {/* Mobile overlay when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-[68px] bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
                        } overflow-hidden flex flex-col`}
                >
                    {/* Scrollable nav area */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className={`material-symbols-outlined transition-transform ${isActive(item.path) ? '' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className={`font-medium flex-1 ${!isSidebarOpen && 'lg:hidden'}`}>
                                    {item.name}
                                </span>
                                {item.badge && isSidebarOpen && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive(item.path)
                                        ? 'bg-white/20 text-white'
                                        : 'bg-primary/10 text-primary'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Help section at bottom - using flex-shrink-0 to prevent overlap */}
                    <div className={`flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${!isSidebarOpen && 'lg:hidden'}`}>
                        <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-lg">help</span>
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Need Help?</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                Check out our admin guide for tips.
                            </p>
                            <Link
                                to="/admin/help"
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-700 transition-colors"
                            >
                                View Guide
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content - Always offset on large screens */}
                <main
                    className={`flex-1 transition-all duration-300 ml-0 lg:ml-64 ${!isSidebarOpen && 'lg:ml-20'}`}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

