import { supabase } from '../lib/supabase';

export interface Appointment {
    id: string;
    service_type: string;
    full_name: string;
    email: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    user_id?: string;
}

export type CreateAppointmentInput = Omit<Appointment, 'id' | 'status' | 'created_at' | 'updated_at'>;
export type UpdateAppointmentInput = Partial<Pick<Appointment, 'status' | 'notes'>>;

export const appointmentService = {
    // Create new appointment (public)
    async create(appointment: CreateAppointmentInput): Promise<Appointment> {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('appointments')
            .insert({
                ...appointment,
                user_id: user?.id || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get user's own appointments
    async getMyAppointments(): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('preferred_date', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get all appointments
    async getAll(): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get appointments by status
    async getByStatus(status: Appointment['status']): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('status', status)
            .order('preferred_date', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Admin: Get today's appointments
    async getToday(): Promise<Appointment[]> {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('preferred_date', today)
            .order('preferred_time', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Admin: Update appointment status
    async updateStatus(id: string, status: Appointment['status'], notes?: string): Promise<Appointment> {
        const updates: UpdateAppointmentInput = { status };
        if (notes) updates.notes = notes;

        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Delete appointment
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get count by status (for dashboard)
    async getStatusCounts(): Promise<Record<string, number>> {
        const { data, error } = await supabase
            .from('appointments')
            .select('status');

        if (error) throw error;

        const counts: Record<string, number> = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
        };

        data?.forEach(a => {
            counts[a.status] = (counts[a.status] || 0) + 1;
        });

        return counts;
    },
};

export default appointmentService;
