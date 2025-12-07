import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    };

    // Create user profile in database
    const createProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
        const { error } = await supabase.from('user_profiles').insert({
            id: userId,
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || null,
            is_subscribed_newsletter: data.is_subscribed_newsletter || false,
        });

        if (error) {
            console.error('Error creating profile:', error);
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id).then(setProfile);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);

                if (session?.user) {
                    const existingProfile = await fetchProfile(session.user.id);
                    if (!existingProfile && event === 'SIGNED_IN') {
                        // Create profile for new OAuth users
                        await createProfile(session.user.id, {
                            full_name: session.user.user_metadata?.full_name || '',
                            email: session.user.email || '',
                        });
                        const newProfile = await fetchProfile(session.user.id);
                        setProfile(newProfile);
                    } else {
                        setProfile(existingProfile);
                    }
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Sign up with email/password
    const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
        setIsLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                },
            },
        });

        if (authError) {
            setIsLoading(false);
            return { error: authError };
        }

        // Create user profile
        if (authData.user) {
            await createProfile(authData.user.id, {
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                is_subscribed_newsletter: data.subscribeNewsletter || false,
            });
        }

        setIsLoading(false);
        return { error: null };
    };

    // Sign in with email/password
    const signIn = async (data: SignInData): Promise<{ error: Error | null }> => {
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        setIsLoading(false);
        return { error };
    };

    // Sign in with Google
    const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });

        return { error };
    };

    // Sign out
    const signOut = async (): Promise<void> => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    // Reset password
    const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        return { error };
    };

    const value: AuthContextType = {
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
