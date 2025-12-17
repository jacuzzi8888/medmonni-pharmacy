import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { profileService } from '../../services/profileService';

const NotificationPreferences: React.FC = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
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
                console.error('Error fetching preferences:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchPreferences();
    }, [user]);

    const handleToggle = async (key: 'sms' | 'whatsapp') => {
        const newValue = !preferences[key];
        setPreferences(prev => ({ ...prev, [key]: newValue }));

        try {
            await profileService.updateProfile({
                preferences: { ...preferences, [key]: newValue }
            });
            success(`${key.toUpperCase()} notifications ${newValue ? 'enabled' : 'disabled'}`);
        } catch (error) {
            // Revert on error
            setPreferences(prev => ({ ...prev, [key]: !newValue }));
            showError('Failed to update preference');
        }
    };

    const handleThemeChange = async (theme: 'light' | 'dark') => {
        setPreferences(prev => ({ ...prev, theme }));

        // Apply theme to document
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);

        try {
            await profileService.updateProfile({
                preferences: { ...preferences, theme }
            });
            success(`Theme changed to ${theme} mode`);
        } catch (error) {
            showError('Failed to save theme preference');
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preferences</h2>

            {/* Notification Preferences */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">notifications</span>
                    Notification Settings
                </h3>

                <div className="space-y-4">
                    {/* SMS Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-500">sms</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                                <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleToggle('sms')}
                            className={`relative w-12 h-6 rounded-full transition-colors ${preferences.sms ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.sms ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    {/* WhatsApp Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-500">chat</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">WhatsApp Notifications</p>
                                <p className="text-sm text-gray-500">Receive updates via WhatsApp</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleToggle('whatsapp')}
                            className={`relative w-12 h-6 rounded-full transition-colors ${preferences.whatsapp ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.whatsapp ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Theme Preference */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">palette</span>
                    Appearance
                </h3>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`p-4 rounded-xl border-2 transition-all ${preferences.theme === 'light'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <span className="material-symbols-outlined text-3xl text-yellow-500 mb-2">light_mode</span>
                        <p className="font-medium text-gray-900 dark:text-white">Light</p>
                    </button>

                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`p-4 rounded-xl border-2 transition-all ${preferences.theme === 'dark'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <span className="material-symbols-outlined text-3xl text-indigo-500 mb-2">dark_mode</span>
                        <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default NotificationPreferences;
