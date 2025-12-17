import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

interface Appointment {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
    service_type: string;
    status: string;
    notes?: string;
    created_at: string;
}

const AppointmentHistory: React.FC = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.email) {
            fetchAppointments();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('email', user?.email)
                .order('preferred_date', { ascending: false });

            if (error) {
                console.warn('Appointments query:', error.message);
                setAppointments([]);
            } else {
                setAppointments(data || []);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelAppointment = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        setCancelingId(id);
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', id)
                .eq('email', user?.email);

            if (error) throw error;

            // Update local state
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
            );
            success('Appointment cancelled successfully');
        } catch (error: any) {
            console.error('Error canceling appointment:', error);
            showError('Failed to cancel appointment');
        } finally {
            setCancelingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-NG', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isUpcoming = (dateStr: string) => {
        return new Date(dateStr) >= new Date(new Date().setHours(0, 0, 0, 0));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    const upcomingAppointments = appointments.filter(a => isUpcoming(a.preferred_date));
    const pastAppointments = appointments.filter(a => !isUpcoming(a.preferred_date));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h2>
                <Link
                    to="/services#book-appointment"
                    onClick={() => setTimeout(() => document.getElementById('book-appointment')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Book New
                </Link>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">
                        calendar_month
                    </span>
                    <p className="text-gray-500 mb-4">No appointments yet</p>
                    <Link
                        to="/services#book-appointment"
                        onClick={() => setTimeout(() => document.getElementById('book-appointment')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                        className="text-primary font-medium hover:underline"
                    >
                        Book your first appointment
                    </Link>
                </div>
            ) : (
                <>
                    {/* Upcoming Appointments */}
                    {upcomingAppointments.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500">upcoming</span>
                                Upcoming ({upcomingAppointments.length})
                            </h3>
                            <div className="space-y-3">
                                {upcomingAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-primary rounded-lg flex flex-col items-center justify-center text-white">
                                                    <span className="text-xs font-bold">
                                                        {new Date(apt.preferred_date).toLocaleDateString('en-NG', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-bold leading-none">
                                                        {new Date(apt.preferred_date).getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{apt.service_type}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(apt.preferred_date)} at {apt.preferred_time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                                                    {apt.status || 'Pending'}
                                                </span>
                                                {apt.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelAppointment(apt.id)}
                                                        disabled={cancelingId === apt.id}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Cancel appointment"
                                                    >
                                                        {cancelingId === apt.id ? (
                                                            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Appointments */}
                    {pastAppointments.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">history</span>
                                Past ({pastAppointments.length})
                            </h3>
                            <div className="space-y-3">
                                {pastAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl opacity-75"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center">
                                                    <span className="text-xs font-bold text-gray-500">
                                                        {new Date(apt.preferred_date).toLocaleDateString('en-NG', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-bold leading-none text-gray-600">
                                                        {new Date(apt.preferred_date).getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">{apt.service_type}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(apt.preferred_date)} at {apt.preferred_time}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                                                {apt.status || 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AppointmentHistory;
