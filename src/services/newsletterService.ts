import { supabase } from '../lib/supabase';

export interface NewsletterSubscriber {
    id: string;
    email: string;
    name?: string;
    is_active: boolean;
    source: string;
    subscribed_at: string;
    unsubscribed_at?: string;
    created_at: string;
}

export type SubscribeInput = Pick<NewsletterSubscriber, 'email' | 'name'>;

export const newsletterService = {
    // Subscribe to newsletter (public)
    async subscribe(input: SubscribeInput): Promise<NewsletterSubscriber> {
        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('email', input.email.toLowerCase())
            .single();

        if (existing) {
            // Reactivate if previously unsubscribed
            if (!existing.is_active) {
                const { data, error } = await supabase
                    .from('newsletter_subscribers')
                    .update({ is_active: true, unsubscribed_at: null })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
            throw new Error('This email is already subscribed');
        }

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email: input.email.toLowerCase(),
                name: input.name,
                source: 'website',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Unsubscribe (public - via email link)
    async unsubscribe(email: string): Promise<void> {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({
                is_active: false,
                unsubscribed_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase());

        if (error) throw error;
    },

    // Admin: Get all subscribers
    async getAll(): Promise<NewsletterSubscriber[]> {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get active subscribers
    async getActive(): Promise<NewsletterSubscriber[]> {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('is_active', true)
            .order('subscribed_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get subscriber count
    async getCount(): Promise<{ total: number; active: number }> {
        const { count: total } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true });

        const { count: active } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        return { total: total || 0, active: active || 0 };
    },

    // Admin: Delete subscriber
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Export emails (for external email service)
    async exportEmails(): Promise<string[]> {
        const subscribers = await this.getActive();
        return subscribers.map(s => s.email);
    },
};

export default newsletterService;
