import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthState, UserProfile, SignUpData, SignInData } from '../types/auth';

// Context type with all auth methods
interface AuthContextType extends AuthState {
    signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
    signIn: (data: SignInData) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
    refreshProfile: () => Promise<void>;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile from database - SIMPLIFIED with AbortController
    const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
        console.log('[Auth] Fetching profile for user:', userId);

        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('[Auth] Aborting request due to timeout');
            controller.abort();
        }, 10000);

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .abortSignal(controller.signal)
                .maybeSingle();

            clearTimeout(timeoutId);

            console.log('[Auth] Query result - data:', data, 'error:', error);

            if (error) {
                console.error('[Auth] Database error:', error.message);
                return null;
            }

            if (!data) {
                console.log('[Auth] No profile found for user');
                return null;
            }

            console.log('[Auth] Profile loaded - role:', data.role);
            return data as UserProfile;

        } catch (err: any) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.error('[Auth] Request was aborted (timeout)');
            } else {
                console.error('[Auth] Fetch error:', err.message);
            }
            return null;
        }
    }, []);

    // Refresh profile
    const refreshProfile = useCallback(async (): Promise<void> => {
        if (user) {
            const newProfile = await fetchProfile(user.id);
            setProfile(newProfile);
        }
    }, [user, fetchProfile]);

    // Create user profile
    const createProfile = useCallback(async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
        try {
            const { error } = await supabase.from('user_profiles').insert({
                id: userId,
                full_name: userData.full_name || '',
                email: userData.email || '',
                phone: userData.phone || null,
                role: 'customer',
                is_subscribed_newsletter: userData.is_subscribed_newsletter || false,
            });

            if (error) {
                console.error('[Auth] Error creating profile:', error.message);
            }
        } catch (err: any) {
            console.error('[Auth] Exception creating profile:', err.message);
        }
    }, []);

    // Initialize auth
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            console.log('[Auth] Initializing...');

            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    console.log('[Auth] Session found:', session.user.email);
                    setUser(session.user);

                    // Fetch profile (don't block on it)
                    fetchProfile(session.user.id).then(p => {
                        if (mounted) setProfile(p);
                    });
                }

                setIsLoading(false);
            } catch (err) {
                console.error('[Auth] Init error:', err);
                if (mounted) setIsLoading(false);
            }
        };

        initAuth();

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                console.log('[Auth] State changed:', event);

                if (!mounted) return;

                if (session?.user) {
                    setUser(session.user);

                    // Fetch profile asynchronously
                    fetchProfile(session.user.id).then(async (p) => {
                        if (!mounted) return;

                        if (!p && event === 'SIGNED_IN') {
                            await createProfile(session.user.id, {
                                full_name: session.user.user_metadata?.full_name || '',
                                email: session.user.email || '',
                            });
                            const newP = await fetchProfile(session.user.id);
                            if (mounted) setProfile(newP);
                        } else {
                            setProfile(p);
                        }
                    });
                } else {
                    setUser(null);
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile, createProfile]);

    // Auth methods
    const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: { data: { full_name: data.fullName } },
            });

            if (error) return { error };

            if (authData.user) {
                await createProfile(authData.user.id, {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    is_subscribed_newsletter: data.subscribeNewsletter || false,
                });
            }

            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    const signIn = async (data: SignInData): Promise<{ error: Error | null }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });
            return { error };
        } catch (err: any) {
            return { error: err };
        }
    };

    const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });
            return { error };
        } catch (err: any) {
            return { error: err };
        }
    };

    const signOut = async (): Promise<void> => {
        console.log('[Auth] Signing out...');
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('[Auth] Sign out error:', err);
        }
        setUser(null);
        setProfile(null);
    };

    const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            return { error };
        } catch (err: any) {
            return { error: err };
        }
    };

    const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            return { error };
        } catch (err: any) {
            return { error: err };
        }
    };

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    const isSuperAdmin = profile?.role === 'super_admin';

    console.log('[Auth] Context - isAdmin:', isAdmin, 'role:', profile?.role);

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            isLoading,
            isAuthenticated: !!user,
            isAdmin,
            isSuperAdmin,
            signUp,
            signIn,
            signInWithGoogle,
            signOut,
            resetPassword,
            updatePassword,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
