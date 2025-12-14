import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { appointmentService } from '../../services/appointmentService';
import { feedbackService } from '../../services/feedbackService';
import { newsletterService } from '../../services/newsletterService';
import { galleryService } from '../../services/galleryService';

interface DashboardStats {
    products: number;
    categories: number;
    pendingAppointments: number;
    newFeedback: number;
    subscribers: number;
    galleryImages: number;
}

const AdminDashboard: React.FC = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        products: 0,
        categories: 0,
        pendingAppointments: 0,
        newFeedback: 0,
        subscribers: 0,
        galleryImages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const [
                    products,
                    categories,
                    appointments,
                    feedback,
                    subscriberCounts,
                    gallery,
                ] = await Promise.all([
                    productService.getActiveProducts(),
                    categoryService.getActiveCategories(),
                    appointmentService.getByStatus('pending'),
                    feedbackService.getByStatus('new'),
                    newsletterService.getCount(),
                    galleryService.getActive(),
                ]);

                setStats({
                    products: products.length,
                    categories: categories.length,
                    pendingAppointments: appointments.length,
                    newFeedback: feedback.length,
                    subscribers: subscriberCounts.active,
                    galleryImages: gallery.length,
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            name: 'Products',
            value: stats.products,
            icon: 'inventory_2',
            color: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            link: '/admin/products',
        },
        {
            name: 'Categories',
            value: stats.categories,
            icon: 'category',
            color: 'from-purple-500 to-purple-600',
            bgLight: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            link: '/admin/categories',
        },
        {
            name: 'Pending Appointments',
            value: stats.pendingAppointments,
            icon: 'calendar_month',
            color: 'from-green-500 to-green-600',
            bgLight: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            link: '/admin/appointments',
        },
        {
            name: 'New Feedback',
            value: stats.newFeedback,
            icon: 'forum',
            color: 'from-orange-500 to-orange-600',
            bgLight: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
            link: '/admin/feedback',
        },
        {
            name: 'Subscribers',
            value: stats.subscribers,
            icon: 'mail',
            color: 'from-pink-500 to-pink-600',
            bgLight: 'bg-pink-50 dark:bg-pink-900/20',
            textColor: 'text-pink-600 dark:text-pink-400',
            link: '/admin/subscribers',
        },
        {
            name: 'Gallery Images',
            value: stats.galleryImages,
            icon: 'photo_library',
            color: 'from-teal-500 to-teal-600',
            bgLight: 'bg-teal-50 dark:bg-teal-900/20',
            textColor: 'text-teal-600 dark:text-teal-400',
            link: '/admin/gallery',
        },
    ];

    const quickActions = [
        {
            name: 'Add Product',
            description: 'Create new product listing',
            icon: 'add_shopping_cart',
            link: '/admin/products',
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton h-32 rounded-2xl" />
                        ))
                    ) : (
                        statCards.map((stat, index) => (
                            <Link
                                key={stat.name}
                                to={stat.link}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Gradient accent top */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                <div className={`${stat.bgLight} p-2 rounded-lg inline-block mb-2`}>
                                    <span className={`material-symbols-outlined ${stat.textColor} text-xl`}>
                                        {stat.icon}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{stat.name}</p>
                            </Link>
                        ))
                    )}
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
                                { icon: 'inventory_2', title: 'Manage Products', desc: 'Add, edit, or remove products', link: '/admin/products' },
                                { icon: 'view_carousel', title: 'Update Carousel', desc: 'Change homepage banners', link: '/admin/carousel' },
                                { icon: 'category', title: 'Organize Categories', desc: 'Create product categories', link: '/admin/categories' },
                                { icon: 'calendar_month', title: 'Handle Appointments', desc: 'View service bookings', link: '/admin/appointments' },
                                { icon: 'forum', title: 'Respond to Feedback', desc: 'Engage with customers', link: '/admin/feedback' },
                                { icon: 'mail', title: 'Newsletter Subscribers', desc: 'Manage email list', link: '/admin/subscribers' },
                            ].map((item) => (
                                <Link key={item.title} to={item.link} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:underline">{item.title}</h4>
                                        <p className="text-white/70 text-sm">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

