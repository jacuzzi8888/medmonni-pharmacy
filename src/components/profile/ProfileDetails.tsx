import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { useToast } from '../../contexts/ToastContext';
import { UserProfile } from '../../types/profile';

const ProfileDetails: React.FC = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                if (data) {
                    setProfile(data);
                    setFormData({
                        full_name: data.full_name || '',
                        phone: data.phone || '',
                        email: data.email || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                showError('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user, showError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await profileService.updateProfile({
                full_name: formData.full_name,
                phone: formData.phone
            });
            success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Details</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Avatar Section (Placeholder for now) */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-3xl">
                        {formData.full_name?.charAt(0) || user?.email?.charAt(0)}
                    </div>
                    <div>
                        <button type="button" className="text-primary font-medium hover:text-primary/80 text-sm">
                            Change Avatar
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Email (Read Only) */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={formData.email}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                Cannot be changed
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            To change your email, please go to <a href="/profile/security" className="text-primary hover:underline">Security Settings</a>.
                        </p>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileDetails;
