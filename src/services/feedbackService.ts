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
}

export type CreateFeedbackInput = Pick<Feedback, 'type' | 'message' | 'email' | 'name' | 'page_url' | 'rating'>;
export type UpdateFeedbackInput = Partial<Pick<Feedback, 'status' | 'admin_notes'>>;

export const feedbackService = {
    // Submit feedback (public) - uses RPC function to bypass RLS
    async submit(feedback: CreateFeedbackInput): Promise<{ id: string }> {
        const { data, error } = await supabase.rpc('submit_feedback', {
            p_type: feedback.type,
            p_message: feedback.message,
            p_email: feedback.email || null,
            p_name: feedback.name || null,
            p_page_url: feedback.page_url || window.location.href,
            p_rating: feedback.rating || null,
        });

        if (error) throw error;
        return { id: data };
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
};

export default feedbackService;
