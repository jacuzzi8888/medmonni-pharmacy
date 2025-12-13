import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { appointmentService, Appointment } from '../../services/appointmentService';

const AppointmentManager: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getAll();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter(a => a.status === filter);

    const handleStatusChange = async (id: string, status: Appointment['status']) => {
        try {
            await appointmentService.updateStatus(id, status);
            fetchAppointments();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this appointment?')) return;
        try {
            await appointmentService.delete(id);
            fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-NG', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const statusCounts = {
        all: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage service booking requests</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                        </button>
                    ))}
                </div>

                {/* Appointments List */}
                {loading ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                        <p className="text-gray-500 mt-2">Loading appointments...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">calendar_month</span>
                        <p className="text-gray-500 mt-2">No appointments found</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    {/* Left: Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {appointment.full_name}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <p className="text-primary font-medium mb-2">{appointment.service_type}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                {formatDate(appointment.preferred_date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                {appointment.preferred_time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">mail</span>
                                                {appointment.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">phone</span>
                                                {appointment.phone}
                                            </span>
                                        </div>
                                        {appointment.notes && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                "{appointment.notes}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2">
                                        {appointment.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title="Confirm"
                                                >
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Cancel"
                                                >
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Mark Completed"
                                            >
                                                <span className="material-symbols-outlined">task_alt</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(appointment.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AppointmentManager;
