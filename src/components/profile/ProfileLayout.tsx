import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileLayout: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
                    <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    const navItems = [
        { path: '/profile', label: 'Overview', icon: 'dashboard' },
        { path: '/profile/details', label: 'My Details', icon: 'person' },
        { path: '/profile/orders', label: 'Orders', icon: 'shopping_bag' },
        { path: '/profile/appointments', label: 'Appointments', icon: 'calendar_month' },
        { path: '/profile/addresses', label: 'Addresses', icon: 'location_on' },
        { path: '/profile/saved', label: 'Saved Items', icon: 'favorite' },
        { path: '/profile/security', label: 'Security', icon: 'security' },
        { path: '/profile/preferences', label: 'Preferences', icon: 'settings' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                            {/* User Brief */}
                            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-gray-900 dark:text-white truncate">
                                        {user.user_metadata?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/profile'}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">logout</span>
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[500px] p-6 md:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
