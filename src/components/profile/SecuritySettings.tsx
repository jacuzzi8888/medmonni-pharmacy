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

    // Email change state
    const [newEmail, setNewEmail] = useState('');
    const [isChangingEmail, setIsChangingEmail] = useState(false);

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
        } catch (error: any) {
            showError(error.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle email change
    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEmail || !newEmail.includes('@')) {
            showError('Please enter a valid email address');
            return;
        }

        setIsChangingEmail(true);
        try {
            const { error } = await supabase.auth.updateUser({
                email: newEmail
            });

            if (error) throw error;

            success('Verification email sent to your new address');
            setNewEmail('');
        } catch (error: any) {
            showError(error.message || 'Failed to update email');
        } finally {
            setIsChangingEmail(false);
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
            // Note: Actual deletion requires a server-side function for security
            // This will sign out the user - full deletion should be handled via Supabase Edge Function
            await signOut();
            success('Account deletion requested. You will be contacted for confirmation.');
        } catch (error: any) {
            showError(error.message || 'Failed to delete account');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>

            {/* Change Password Section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">lock</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your password regularly to keep your account secure</p>
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
                            minLength={6}
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
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </section>

            {/* Change Email Section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500">mail</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Change Email</h3>
                        <p className="text-sm text-gray-500">Current: {user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="Enter new email address"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isChangingEmail}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {isChangingEmail ? 'Sending...' : 'Change Email'}
                    </button>
                </form>
            </section>

            {/* Two-Factor Authentication */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">security</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Coming Soon
                    </span>
                </div>
            </section>

            {/* Connected Accounts */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-500">link</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Connected Accounts</h3>
                        <p className="text-sm text-gray-500">Manage your social login connections</p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Google</span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {user?.app_metadata?.provider === 'google' ? 'Connected' : 'Not connected'}
                    </span>
                </div>
            </section>

            {/* Danger Zone - Delete Account */}
            <section className="border-2 border-red-200 dark:border-red-900 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
                        <p className="text-sm text-gray-500">Irreversible actions</p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">delete_forever</span>
                        Delete my account
                    </button>
                ) : (
                    <div className="space-y-4 max-w-md">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type <strong>DELETE</strong> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/50 outline-none"
                                placeholder="DELETE"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText('');
                                }}
                                className="text-gray-600 hover:text-gray-800 px-4 py-2"
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
