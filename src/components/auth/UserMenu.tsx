import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ChangePasswordModal from './ChangePasswordModal';

const UserMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, profile, signOut, isAuthenticated, isAdmin } = useAuth();

    // Debug logging
    useEffect(() => {
        if (isAuthenticated) {
            console.log('[UserMenu] User authenticated, isAdmin:', isAdmin, 'profile.role:', profile?.role);
        }
    }, [isAuthenticated, isAdmin, profile?.role]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleSignOut = () => {
        console.log('[UserMenu] Sign out clicked - forcing logout');
        setIsOpen(false);

        // Clear all local storage
        localStorage.clear();
        sessionStorage.clear();

        // Try to sign out (don't await - just fire and forget)
        supabase.auth.signOut().catch(console.error);

        // Force reload after a short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    };

    return (
        <>
            <div className="relative" ref={menuRef}>
                {/* Avatar Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {initials}
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {displayName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {user?.email}
                            </p>
                            {profile?.role && profile.role !== 'customer' && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                    {profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </span>
                            )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {/* Admin Link - Only for admins */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-primary font-medium hover:bg-primary/10 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                                    Admin Dashboard
                                </Link>
                            )}
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                Order History
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsChangePasswordOpen(true);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                Change Password
                            </button>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </>
    );
};

export default UserMenu;
