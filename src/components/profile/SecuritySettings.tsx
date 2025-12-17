import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

const SecuritySettings: React.FC = () => {
    const { user, signOut } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Email Change State
    const [emailForm, setEmailForm] = useState({
        newEmail: ''
    });

    // Delete Account State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.newPassword
            });

            if (error) throw error;
            toast.success('Password updated successfully');
            setPasswordForm({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailForm.newEmail) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                email: emailForm.newEmail
            });

            if (error) throw error;
            toast.success('Confirmation link sent to new email');
            setEmailForm({ newEmail: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') return;

        setIsLoading(true);
        try {
            // In a real app, you might want to soft-delete or use an Edge Function
            // For now, we'll use the admin API (if enabled) or just sign out
            // Note: Client-side deletion requires specific Supabase config

            // For safety, we'll just sign them out and show a message
            // A real implementation would call a backend function
            toast.error('Account deletion requires contacting support for safety.');

            // await supabase.rpc('delete_user'); // Example RPC
            // await signOut();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete account');
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your password and account security.</p>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Min. 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Re-enter new password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !passwordForm.newPassword}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Change Email */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Current email: <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </p>
                <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Email Address</label>
                        <input
                            type="email"
                            value={emailForm.newEmail}
                            onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Enter new email"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !emailForm.newEmail}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Confirmation'}
                    </button>
                </form>
            </div>

            {/* Two-Factor Authentication (Placeholder) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 opacity-75">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account.</p>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">Coming Soon</span>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Delete Account</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                    Permanently delete your account and all of your content. This action cannot be undone.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="space-y-4 max-w-md animate-fade-in">
                        <p className="text-sm font-bold text-red-600">
                            Type "DELETE" to confirm account deletion:
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500/50 outline-none"
                                placeholder="DELETE"
                            />
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== 'DELETE' || isLoading}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-600 hover:text-gray-800 px-4 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecuritySettings;
