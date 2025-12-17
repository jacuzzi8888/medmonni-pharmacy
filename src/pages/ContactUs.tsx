import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Have a question about your medication? Need help with an order? Our team is here to assist you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Visit Us</h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">1 Niyi Okunubi Street<br />Lekki Phase 1, Lagos</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary">call</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">+234 705 235 0000</p>
                                <p className="text-sm text-gray-500 mt-1">Mon-Sat: 8am - 9pm</p>
                                <p className="text-sm text-gray-500">Sun: 12pm - 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary">mail</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Email Us</h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">support@medomni.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    {status === 'success' ? (
                        <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl text-center h-full flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Message Sent!</h3>
                            <p className="text-gray-600 dark:text-gray-300">We'll get back to you as soon as possible.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-primary font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
