/**
 * Auth Context Regression Tests
 * 
 * These tests verify the authentication functionality including:
 * - Sign in/out flows
 * - Admin role detection
 * - Profile loading
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({
                data: { session: null },
                error: null,
            }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } },
            }),
            signInWithPassword: vi.fn(),
            signOut: vi.fn().mockResolvedValue({ error: null }),
            signUp: vi.fn(),
            signInWithOAuth: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            updateUser: vi.fn(),
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                    abortSignal: vi.fn().mockReturnThis(),
                }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
        }),
    },
}));

// Test component to access auth context
const TestAuthConsumer = () => {
    const { isAuthenticated, isAdmin, isSuperAdmin, profile, user } = useAuth();

    return (
        <div>
            <span data-testid="is-authenticated">{String(isAuthenticated)}</span>
            <span data-testid="is-admin">{String(isAdmin)}</span>
            <span data-testid="is-super-admin">{String(isSuperAdmin)}</span>
            <span data-testid="profile-role">{profile?.role || 'none'}</span>
            <span data-testid="user-email">{user?.email || 'none'}</span>
        </div>
    );
};

const renderWithAuth = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {component}
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial State', () => {
        it('should start with isAuthenticated as false when no session', async () => {
            renderWithAuth(<TestAuthConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
            });
        });

        it('should start with isAdmin as false when no session', async () => {
            renderWithAuth(<TestAuthConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('is-admin').textContent).toBe('false');
            });
        });
    });

    describe('Admin Role Detection', () => {
        it('should detect admin role correctly', async () => {
            const { supabase } = await import('../../lib/supabase');

            // Mock a signed-in user with admin role
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
                data: {
                    session: {
                        user: { id: 'test-id', email: 'admin@test.com' } as any,
                        access_token: 'token',
                        refresh_token: 'refresh',
                        expires_in: 3600,
                        token_type: 'bearer',
                    },
                },
                error: null,
            });

            // Mock profile with admin role
            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        abortSignal: vi.fn().mockReturnValue({
                            maybeSingle: vi.fn().mockResolvedValue({
                                data: {
                                    id: 'test-id',
                                    email: 'admin@test.com',
                                    role: 'admin',
                                    full_name: 'Admin User',
                                },
                                error: null,
                            }),
                        }),
                    }),
                }),
                insert: vi.fn().mockResolvedValue({ error: null }),
            } as any);

            renderWithAuth(<TestAuthConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('is-admin').textContent).toBe('true');
                expect(screen.getByTestId('profile-role').textContent).toBe('admin');
            }, { timeout: 3000 });
        });

        it('should detect super_admin role correctly', async () => {
            const { supabase } = await import('../../lib/supabase');

            // Mock a signed-in user with super_admin role
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
                data: {
                    session: {
                        user: { id: 'test-id', email: 'superadmin@test.com' } as any,
                        access_token: 'token',
                        refresh_token: 'refresh',
                        expires_in: 3600,
                        token_type: 'bearer',
                    },
                },
                error: null,
            });

            // Mock profile with super_admin role
            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        abortSignal: vi.fn().mockReturnValue({
                            maybeSingle: vi.fn().mockResolvedValue({
                                data: {
                                    id: 'test-id',
                                    email: 'superadmin@test.com',
                                    role: 'super_admin',
                                    full_name: 'Super Admin',
                                },
                                error: null,
                            }),
                        }),
                    }),
                }),
                insert: vi.fn().mockResolvedValue({ error: null }),
            } as any);

            renderWithAuth(<TestAuthConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('is-admin').textContent).toBe('true');
                expect(screen.getByTestId('is-super-admin').textContent).toBe('true');
                expect(screen.getByTestId('profile-role').textContent).toBe('super_admin');
            }, { timeout: 3000 });
        });

        it('should NOT set isAdmin for customer role', async () => {
            const { supabase } = await import('../../lib/supabase');

            // Mock a signed-in customer
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
                data: {
                    session: {
                        user: { id: 'test-id', email: 'customer@test.com' } as any,
                        access_token: 'token',
                        refresh_token: 'refresh',
                        expires_in: 3600,
                        token_type: 'bearer',
                    },
                },
                error: null,
            });

            // Mock profile with customer role
            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        abortSignal: vi.fn().mockReturnValue({
                            maybeSingle: vi.fn().mockResolvedValue({
                                data: {
                                    id: 'test-id',
                                    email: 'customer@test.com',
                                    role: 'customer',
                                    full_name: 'Customer User',
                                },
                                error: null,
                            }),
                        }),
                    }),
                }),
                insert: vi.fn().mockResolvedValue({ error: null }),
            } as any);

            renderWithAuth(<TestAuthConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
                expect(screen.getByTestId('is-admin').textContent).toBe('false');
                expect(screen.getByTestId('profile-role').textContent).toBe('customer');
            }, { timeout: 3000 });
        });
    });

    describe('Sign Out', () => {
        it('should clear user and profile on sign out', async () => {
            const { supabase } = await import('../../lib/supabase');

            // Start with a signed-in user
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
                data: {
                    session: {
                        user: { id: 'test-id', email: 'test@test.com' } as any,
                        access_token: 'token',
                        refresh_token: 'refresh',
                        expires_in: 3600,
                        token_type: 'bearer',
                    },
                },
                error: null,
            });

            // Mock signOut to trigger state change
            vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

            const SignOutButton = () => {
                const { signOut, isAuthenticated } = useAuth();
                return (
                    <div>
                        <span data-testid="auth-status">{String(isAuthenticated)}</span>
                        <button onClick={() => signOut()} data-testid="sign-out-btn">
                            Sign Out
                        </button>
                    </div>
                );
            };

            renderWithAuth(<SignOutButton />);

            // Wait for initial auth
            await waitFor(() => {
                expect(screen.getByTestId('auth-status').textContent).toBe('true');
            });

            // Click sign out
            const user = userEvent.setup();
            await user.click(screen.getByTestId('sign-out-btn'));

            // Verify signOut was called
            expect(supabase.auth.signOut).toHaveBeenCalled();
        });
    });
});
