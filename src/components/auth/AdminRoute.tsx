import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Protected route component that requires admin access
 * Redirects non-admin users to homepage
 */
const AdminRoute: React.FC = () => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to home if not authenticated or not an admin
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Render child routes if user is admin
    return <Outlet />;
};

export default AdminRoute;
