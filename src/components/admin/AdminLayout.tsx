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
        { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { name: 'Carousel', path: '/admin/carousel', icon: 'view_carousel' },
        { name: 'Categories', path: '/admin/categories', icon: 'category' },
        { name: 'Navigation', path: '/admin/navigation', icon: 'menu' },
        { name: 'Products', path: '/admin/products', icon: 'inventory_2' },
        { name: 'Appointments', path: '/admin/appointments', icon: 'calendar_month' },
        { name: 'Feedback', path: '/admin/feedback', icon: 'forum' },
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
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        {/* Logo */}
                        <Link to="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Back to site */}
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Site
                        </Link>

                        {/* User menu */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {profile?.full_name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {profile?.role?.replace('_', ' ') || 'admin'}
                                </p>
                            </div>
                            <button
                                onClick={signOut}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                title="Sign Out"
                            >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
                        } overflow-hidden`}
                >
                    <nav className="p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className={`font-medium ${!isSidebarOpen && 'lg:hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                        }`}
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
