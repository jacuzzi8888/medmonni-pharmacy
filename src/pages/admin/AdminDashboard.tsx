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
            color: 'bg-blue-500',
            link: '/admin/products',
        },
        {
            name: 'Categories',
            value: '6',
            icon: 'category',
            color: 'bg-purple-500',
            link: '/admin/categories',
        },
        {
            name: 'Pending Appointments',
            value: '0',
            icon: 'calendar_month',
            color: 'bg-green-500',
            link: '/admin/appointments',
        },
        {
            name: 'New Feedback',
            value: '0',
            icon: 'forum',
            color: 'bg-orange-500',
            link: '/admin/feedback',
        },
    ];

    const quickActions = [
        {
            name: 'Add Product',
            icon: 'add_shopping_cart',
            link: '/admin/products/new',
            color: 'bg-primary',
        },
        {
            name: 'Manage Carousel',
            icon: 'view_carousel',
            link: '/admin/carousel',
            color: 'bg-indigo-600',
        },
        {
            name: 'Add Category',
            icon: 'add_circle',
            link: '/admin/categories',
            color: 'bg-purple-600',
        },
        {
            name: 'View Feedback',
            icon: 'chat',
            link: '/admin/feedback',
            color: 'bg-orange-600',
        },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {profile?.full_name || 'Admin'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your pharmacy today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Link
                            key={stat.name}
                            to={stat.link}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <span className="material-symbols-outlined text-white text-2xl">
                                        {stat.icon}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.name}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                to={action.link}
                                className={`${action.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-3 text-center`}
                            >
                                <span className="material-symbols-outlined text-4xl">{action.icon}</span>
                                <span className="font-semibold">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Getting Started Guide */}
                <div className="bg-gradient-to-br from-primary to-accent-red rounded-xl shadow-md p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">🚀 Getting Started</h2>
                    <p className="mb-6 opacity-90">
                        Your admin panel is ready! Here's what you can do:
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">check_circle</span>
                            <span><strong>Manage Products:</strong> Add, edit, or remove products from your catalog</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">check_circle</span>
                            <span><strong>Update Carousel:</strong> Change homepage hero images and campaigns</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">check_circle</span>
                            <span><strong>Organize Categories:</strong> Create and manage product categories</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">check_circle</span>
                            <span><strong>Handle Appointments:</strong> View and manage service bookings</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">check_circle</span>
                            <span><strong>Respond to Feedback:</strong> Engage with customer messages</span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
