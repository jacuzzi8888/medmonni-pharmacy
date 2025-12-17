import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { UserProfile, Address } from '../../types/profile';

const ProfileDashboard: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, addressData] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getAddresses()
                ]);
                setProfile(profileData);
                setAddresses(addressData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const defaultAddress = addresses.find(a => a.is_default) || addresses[0];

    const quickLinks = [
        { path: '/profile/orders', icon: 'shopping_bag', label: 'Orders', color: 'bg-blue-500' },
        { path: '/profile/addresses', icon: 'location_on', label: 'Addresses', color: 'bg-green-500' },
        { path: '/profile/saved', icon: 'favorite', label: 'Saved', color: 'bg-red-500' },
        { path: '/profile/security', icon: 'security', label: 'Security', color: 'bg-purple-500' },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-red rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
                    </h2>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all group"
                    >
                        <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-white">{link.icon}</span>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{link.label}</p>
                    </Link>
                ))}
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Summary */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Personal Info
                        </h3>
                        <Link to="/profile/details" className="text-primary text-sm hover:underline">
                            Edit
                        </Link>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Full Name</p>
                            <p className="text-gray-900 dark:text-white">{profile?.full_name || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                            <p className="text-gray-900 dark:text-white">{profile?.phone || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Email</p>
                            <p className="text-gray-900 dark:text-white">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Default Address */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">location_on</span>
                            Default Address
                        </h3>
                        <Link to="/profile/addresses" className="text-primary text-sm hover:underline">
                            Manage
                        </Link>
                    </div>
                    {defaultAddress ? (
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{defaultAddress.type}</p>
                            <p className="text-gray-600 dark:text-gray-300">{defaultAddress.street}</p>
                            <p className="text-gray-500 text-sm">{defaultAddress.city}, {defaultAddress.state}</p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-2">No address saved</p>
                            <Link to="/profile/addresses" className="text-primary font-medium hover:underline">
                                Add Address
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">history</span>
                    Recent Activity
                </h3>
                <div className="text-center py-8 text-gray-500">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">pending_actions</span>
                    <p>Your recent orders and appointments will appear here</p>
                </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-r from-primary to-accent-red rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-3xl">support_agent</span>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                        <p className="text-white/80 text-sm mb-3">
                            Our team is here to assist you with any questions or concerns.
                        </p>
                        <a
                            href="tel:+2347052350000"
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">call</span>
                            Call 07052350000
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
