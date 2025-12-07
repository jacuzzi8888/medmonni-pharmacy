import { User } from '@supabase/supabase-js';

// User profile stored in our database
export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    is_subscribed_newsletter: boolean;
    created_at: string;
    updated_at: string;
}

// Auth state for the context
export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Sign up form data
export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    subscribeNewsletter?: boolean;
}

// Sign in form data
export interface SignInData {
    email: string;
    password: string;
}
