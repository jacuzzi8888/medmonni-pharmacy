import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { useToast } from '../../contexts/ToastContext';

const Preferences: React.FC = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [preferences, setPreferences] = useState({
        sms: false,
        whatsapp: false,
        theme: 'light' as 'light' | 'dark'
    });

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const profile = await profileService.getProfile();
                if (profile?.preferences) {
                    setPreferences(profile.preferences);
                }
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchPreferences();
        }
    }, [user]);

    const handleToggle = async (key: keyof typeof preferences) => {
        const newPreferences = {
            ...preferences,
            [key]: key === 'theme'
                ? (preferences.theme === 'light' ? 'dark' : 'light')
                : !preferences[key]
        };

        setPreferences(newPreferences);
        setIsSaving(true);

        try {
            await profileService.updateProfile({
                preferences: newPreferences
            });

            // Apply theme immediately if changed
            if (key === 'theme') {
                if (newPreferences.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                localStorage.setItem('theme', newPreferences.theme);
            }

            toast.success('Preferences saved');
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Failed to save preferences');
            // Revert on error
            setPreferences(preferences);
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
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your notification and display settings.</p>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Notifications</h3>

                <div className="space-y-6">
                    {/* SMS Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive order updates and delivery status via SMS.</p>
                        </div>
                        <button
                            onClick={() => handleToggle('sms')}
                            disabled={isSaving}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${preferences.sms ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.sms ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* WhatsApp Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">WhatsApp Notifications</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive prescription reminders and health tips via WhatsApp.</p>
                        </div>
                        <button
                            onClick={() => handleToggle('whatsapp')}
                            disabled={isSaving}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${preferences.whatsapp ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.whatsapp ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Appearance</h3>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes.</p>
                    </div>
                    <button
                        onClick={() => handleToggle('theme')}
                        disabled={isSaving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${preferences.theme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Preferences;
