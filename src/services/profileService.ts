import { supabase } from '../lib/supabase';
import { UserProfile, Address, SavedItem } from '../types/profile';

export const profileService = {
    // --- Profile ---
    async getProfile(): Promise<UserProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return {
            ...data,
            email: user.email // Merge email from auth
        };
    },

    async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // --- Addresses ---
    async getAddresses(): Promise<Address[]> {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // If setting as default, unset others first
        if (address.is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id);
        }

        const { data, error } = await supabase
            .from('addresses')
            .insert({ ...address, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // If setting as default, unset others first
        if (updates.is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id);
        }

        const { data, error } = await supabase
            .from('addresses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteAddress(id: string): Promise<void> {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Saved Items ---
    async getSavedItems(type?: 'product' | 'article'): Promise<SavedItem[]> {
        let query = supabase.from('saved_items').select('*');

        if (type) {
            query = query.eq('item_type', type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async saveItem(type: 'product' | 'article', itemId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('saved_items')
            .upsert({
                user_id: user.id,
                item_type: type,
                item_id: itemId
            }, { onConflict: 'user_id, item_type, item_id' });

        if (error) throw error;
    },

    async unsaveItem(type: 'product' | 'article', itemId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('saved_items')
            .delete()
            .match({ user_id: user.id, item_type: type, item_id: itemId });

        if (error) throw error;
    }
};
