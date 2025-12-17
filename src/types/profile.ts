export interface UserProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    email?: string; // From auth.users, not stored in profiles table
    preferences: {
        sms: boolean;
        whatsapp: boolean;
        theme: 'light' | 'dark';
    };
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    type: string;
    is_default: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
    created_at?: string;
}

export interface SavedItem {
    id: string;
    user_id: string;
    item_type: 'product' | 'article';
    item_id: string;
    created_at: string;
    // Expanded data (joined)
    product?: any;
    article?: any;
}
