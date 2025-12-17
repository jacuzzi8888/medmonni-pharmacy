import React, { useState, useEffect } from 'react';
import { appointmentService, CreateAppointmentInput } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';

interface AppointmentFormProps {
    onSuccess?: () => void;
}

const SERVICES = [
    { value: 'Prescription Refill', icon: 'medication', description: 'Refill your existing prescriptions' },
    { value: 'Health Consultation', icon: 'stethoscope', description: 'Speak with our pharmacist' },
    { value: 'Blood Pressure Check', icon: 'monitor_heart', description: 'Free BP monitoring' },
    { value: 'Blood Sugar Test', icon: 'bloodtype', description: 'Quick glucose check' },
    { value: 'Vaccination', icon: 'vaccines', description: 'Get vaccinated safely' },
    { value: 'Medication Review', icon: 'fact_check', description: 'Review your medications' },
];

const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess }) => {
    const { user, profile } = useAuth();
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [dateError, setDateError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAppointmentInput>({
        service_type: '',
        full_name: '',
        email: '',
        phone: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
    });

    // Prefill email and name from logged-in user
    useEffect(() => {
        if (user?.email && !formData.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                full_name: profile?.full_name || prev.full_name,
                phone: profile?.phone || prev.phone
            }));
        }
    }, [user, profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await appointmentService.create(formData);
            setStatus('success');
            onSuccess?.();
        } catch (error) {
            console.error('Error booking appointment:', error);
            setStatus('error');
        }
    };

    const updateField = (field: keyof CreateAppointmentInput, value: string) => {
        // Validate date is not in the past
        if (field === 'preferred_date') {
            const selectedDate = new Date(value);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);

            if (selectedDate < todayDate) {
                setDateError('Please select a future date');
                return;
            }
            setDateError(null);
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isStep1Valid = formData.service_type !== '';
    const isStep2Valid = formData.preferred_date !== '' && formData.preferred_time !== '';
    const isStep3Valid = formData.full_name !== '' && formData.email !== '' && formData.phone !== '';

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    if (status === 'success') {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appointment Booked!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    We've received your booking for <span className="font-medium">{formData.service_type}</span> on{' '}
                    <span className="font-medium">{new Date(formData.preferred_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</span> at{' '}
                    <span className="font-medium">{formData.preferred_time}</span>.
                </p>
                <p className="text-sm text-gray-400">We'll send a confirmation to {formData.email}</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}
                        >
                            {step > s ? <span className="material-symbols-outlined text-lg">check</span> : s}
                        </div>
                        {s < 3 && (
                            <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            What service do you need?
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {SERVICES.map((service) => (
                                <button
                                    key={service.value}
                                    type="button"
                                    onClick={() => updateField('service_type', service.value)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.service_type === service.value
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-2xl mb-2 ${formData.service_type === service.value ? 'text-primary' : 'text-gray-400'
                                        }`}>
                                        {service.icon}
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{service.value}</p>
                                    <p className="text-xs text-gray-500">{service.description}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!isStep1Valid}
                            className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            When would you like to come?
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={formData.preferred_date}
                                onChange={(e) => updateField('preferred_date', e.target.value)}
                                className={`w-full p-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none ${dateError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                            {dateError && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                    {dateError}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Time
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {TIME_SLOTS.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => updateField('preferred_time', time)}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.preferred_time === time
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                disabled={!isStep2Valid}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Contact Details */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Your Contact Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => updateField('full_name', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="080 1234 5678"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => updateField('notes', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                                    rows={3}
                                    placeholder="Any additional information..."
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm">
                                Failed to book appointment. Please try again.
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isStep3Valid || status === 'submitting'}
                                className="flex-1 py-3 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                                        Book Appointment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AppointmentForm;
