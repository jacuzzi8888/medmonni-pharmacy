import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
    const { profile } = useAuth();

    const stats = [
        {
            name: 'Total Products',
            value: '4',
            icon: 'inventory_2',
            color: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            link: '/admin/products',
            trend: '+2 this week',
            trendUp: true,
        },
        {
            name: 'Categories',
            value: '6',
            icon: 'category',
            color: 'from-purple-500 to-purple-600',
            bgLight: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            link: '/admin/categories',
            trend: 'Active',
            trendUp: true,
        },
        {
            name: 'Pending Appointments',
            value: '0',
            icon: 'calendar_month',
            color: 'from-green-500 to-green-600',
            bgLight: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            link: '/admin/appointments',
            trend: 'All clear',
            trendUp: true,
        },
        {
            name: 'New Feedback',
            value: '0',
            icon: 'forum',
            color: 'from-orange-500 to-orange-600',
            bgLight: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
            link: '/admin/feedback',
            trend: 'No new messages',
            trendUp: true,
        },
    ];

    const quickActions = [
        {
            name: 'Add Product',
            description: 'Create new product listing',
            icon: 'add_shopping_cart',
            link: '/admin/products/new',
            color: 'from-primary to-blue-700',
        },
        {
            name: 'Manage Carousel',
            description: 'Update homepage banners',
            icon: 'view_carousel',
            link: '/admin/carousel',
            color: 'from-indigo-500 to-indigo-700',
        },
        {
            name: 'Add Category',
            description: 'Organize your products',
            icon: 'add_circle',
            link: '/admin/categories',
            color: 'from-purple-500 to-purple-700',
        },
        {
            name: 'View Feedback',
            description: 'Check customer messages',
            icon: 'chat',
            link: '/admin/feedback',
            color: 'from-orange-500 to-orange-700',
        },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            System Online
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {profile?.full_name || 'Admin'}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your pharmacy today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Link
                            key={stat.name}
                            to={stat.link}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient accent top */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgLight} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                                    <span className={`material-symbols-outlined ${stat.textColor} text-2xl`}>
                                        {stat.icon}
                                    </span>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
                                    arrow_forward
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.name}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                            <div className="flex items-center gap-1 text-xs">
                                <span className={`material-symbols-outlined text-[14px] ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.trendUp ? 'trending_up' : 'trending_down'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">{stat.trend}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Quick Actions
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                to={action.link}
                                className={`group relative bg-gradient-to-br ${action.color} text-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden`}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{action.name}</h3>
                                    <p className="text-white/70 text-sm">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Getting Started Guide */}
                <div className="relative bg-gradient-to-br from-primary via-blue-800 to-accent-red rounded-2xl shadow-xl p-8 text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-red/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🚀</span>
                            <h2 className="text-2xl font-bold">Getting Started</h2>
                        </div>
                        <p className="mb-6 text-white/80 max-w-2xl">
                            Your admin panel is ready! Here's what you can do to manage your pharmacy:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: 'inventory_2', title: 'Manage Products', desc: 'Add, edit, or remove products' },
                                { icon: 'view_carousel', title: 'Update Carousel', desc: 'Change homepage banners' },
                                { icon: 'category', title: 'Organize Categories', desc: 'Create product categories' },
                                { icon: 'calendar_month', title: 'Handle Appointments', desc: 'View service bookings' },
                                { icon: 'forum', title: 'Respond to Feedback', desc: 'Engage with customers' },
                                { icon: 'admin_panel_settings', title: 'Admin Settings', desc: 'Configure your panel' },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{item.title}</h4>
                                        <p className="text-white/70 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

