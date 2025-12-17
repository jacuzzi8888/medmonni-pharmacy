import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

const SecuritySettings: React.FC = () => {
    const { user, signOut } = useAuth();
    const { success, error: showError } = useToast();

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        setIsChangingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            showError(err.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            showError('Please type DELETE to confirm');
            return;
        }

        setIsDeleting(true);
        try {
            // Note: Full account deletion requires a server-side function
            // For now, we'll sign the user out and show a message
            await signOut();
            success('Account deletion requested. Contact support for full removal.');
        } catch (err: any) {
            showError(err.message || 'Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>

            {/* Change Password Section */}
            <section className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">lock</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your password regularly for security</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isChangingPassword ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </section>

            {/* Connected Accounts Section */}
            <section className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">link</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Connected Accounts</h3>
                        <p className="text-sm text-gray-500">Manage your linked sign-in methods</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Google Account */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Google</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Connected</span>
                    </div>
                </div>
            </section>

            {/* Notification Preferences */}
            <section className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600">notifications</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
                        <p className="text-sm text-gray-500">Choose how you want to be contacted</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* SMS Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">sms</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                                <p className="text-xs text-gray-500">Receive order updates via SMS</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* WhatsApp Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-600">chat</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">WhatsApp Notifications</p>
                                <p className="text-xs text-gray-500">Receive updates on WhatsApp</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600">warning</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-600">Danger Zone</h3>
                        <p className="text-sm text-gray-500">Irreversible actions</p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">delete_forever</span>
                        Delete My Account
                    </button>
                ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 space-y-4">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                                Type <strong>DELETE</strong> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500/50 outline-none"
                                placeholder="Type DELETE"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText('');
                                }}
                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default SecuritySettings;
