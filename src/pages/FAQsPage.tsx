import React, { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

const FAQS: FAQ[] = [
    {
        category: 'Orders & Delivery',
        question: 'How long does delivery take?',
        answer: 'We offer same-day delivery within Lagos for orders placed before 2 PM. For other locations in Nigeria, delivery typically takes 2-3 business days.'
    },
    {
        category: 'Orders & Delivery',
        question: 'What are your delivery fees?',
        answer: 'Delivery within Lagos is ₦1,500 for orders under ₦20,000 and FREE for orders above ₦20,000. Interstate delivery fees vary based on location.'
    },
    {
        category: 'Orders & Delivery',
        question: 'Can I track my order?',
        answer: 'Yes! Once your order is dispatched, you\'ll receive a WhatsApp message with tracking information. You can also contact us on WhatsApp for real-time updates.'
    },
    {
        category: 'Prescriptions',
        question: 'Do I need a prescription to buy medication?',
        answer: 'Prescription medications require a valid prescription from a licensed healthcare provider. Over-the-counter medications can be purchased without a prescription.'
    },
    {
        category: 'Prescriptions',
        question: 'How do I submit my prescription?',
        answer: 'You can send a clear photo of your prescription via WhatsApp to 07052350000, or bring it to our store in person. Our pharmacist will verify it before dispensing.'
    },
    {
        category: 'Prescriptions',
        question: 'Can you refill my prescription?',
        answer: 'Yes! For refills, simply contact us with your previous order details or prescription number. We keep records for easy refills, subject to prescription validity.'
    },
    {
        category: 'Payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, card payments (via Paystack), and cash on delivery within Lagos. All online payments are secure and encrypted.'
    },
    {
        category: 'Payments',
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use Paystack, a PCI-DSS compliant payment processor. We never store your card details on our servers.'
    },
    {
        category: 'Services',
        question: 'Are your health screenings really free?',
        answer: 'Yes! We offer free blood pressure checks and basic health consultations as part of our community health initiative. No purchase required.'
    },
    {
        category: 'Services',
        question: 'Do you offer home visits?',
        answer: 'For certain services like vaccinations and health check-ups, we can arrange home visits within Lagos. Contact us for availability and pricing.'
    },
    {
        category: 'Returns',
        question: 'What is your return policy?',
        answer: 'Unopened medications in original packaging can be returned within 7 days for a full refund. Opened medications cannot be returned for safety reasons.'
    },
    {
        category: 'Returns',
        question: 'What if I receive a damaged product?',
        answer: 'Contact us immediately with photos of the damaged item. We\'ll arrange a replacement or full refund at no extra cost to you.'
    },
];

const FAQsPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(FAQS.map(faq => faq.category)))];

    const filteredFAQs = activeCategory === 'All'
        ? FAQS
        : FAQS.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary to-blue-800 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[14px]">help</span>
                        Help Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Find answers to common questions about our services, delivery, and more.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => { setActiveCategory(category); setOpenIndex(null); }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-primary/30"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:flex w-10 h-10 bg-primary/10 rounded-lg items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">quiz</span>
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-5 pt-0">
                                        <div className="pl-0 sm:pl-14 text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-12 bg-gray-100 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Our team is ready to help you with any questions you may have.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/2347052350000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                        <a
                            href="tel:07052350000"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
                        >
                            <span className="material-symbols-outlined">call</span>
                            Call Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQsPage;
