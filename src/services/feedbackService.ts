import { supabase } from '../lib/supabase';

export interface Feedback {
    id: string;
    type: 'suggestion' | 'complaint' | 'praise' | 'question' | 'bug';
    message: string;
    email?: string;
    name?: string;
    page_url?: string;
    rating?: number;
    status: 'new' | 'read' | 'responded' | 'archived';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    user_id?: string;
    is_featured?: boolean;
}

export type CreateFeedbackInput = Pick<Feedback, 'type' | 'message' | 'email' | 'name' | 'page_url' | 'rating'>;
export type UpdateFeedbackInput = Partial<Pick<Feedback, 'status' | 'admin_notes' | 'is_featured'>>;

export const feedbackService = {
    // Submit feedback (public)
    async submit(feedback: CreateFeedbackInput): Promise<{ id: string }> {
        const { data, error } = await supabase
            .from('feedback')
            .insert({
                type: feedback.type,
                message: feedback.message,
                email: feedback.email || null,
                name: feedback.name || null,
                page_url: feedback.page_url || window.location.href,
                rating: feedback.rating || null,
                status: 'new',
            })
            .select('id')
            .single();

        if (error) throw error;
        return { id: data.id };
    },

    // Admin: Get all feedback
    async getAll(): Promise<Feedback[]> {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get feedback by status
    async getByStatus(status: Feedback['status']): Promise<Feedback[]> {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get new feedback count
    async getNewCount(): Promise<number> {
        const { count, error } = await supabase
            .from('feedback')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new');

        if (error) throw error;
        return count || 0;
    },

    // Admin: Update feedback
    async update(id: string, updates: UpdateFeedbackInput): Promise<Feedback> {
        const { data, error } = await supabase
            .from('feedback')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Mark as read
    async markAsRead(id: string): Promise<Feedback> {
        return this.update(id, { status: 'read' });
    },

    // Admin: Archive feedback
    async archive(id: string): Promise<Feedback> {
        return this.update(id, { status: 'archived' });
    },

    // Admin: Delete feedback
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Toggle featured status
    async toggleFeatured(id: string, is_featured: boolean): Promise<Feedback> {
        return this.update(id, { is_featured });
    },

    // Public: Get featured feedback for testimonials
    async getFeatured(): Promise<Feedback[]> {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        return data || [];
    },
};

export default feedbackService;
