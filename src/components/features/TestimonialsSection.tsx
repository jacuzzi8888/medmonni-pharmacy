import React, { useState, useEffect } from 'react';

interface Testimonial {
    id: string;
    customer_name: string;
    rating: number;
    content: string;
    is_featured: boolean;
    created_at: string;
}

// Static testimonials data (fallback)
const STATIC_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        customer_name: 'Mrs. Adaeze O.',
        rating: 5,
        content: 'Excellent service! The staff is very knowledgeable and helped me find exactly what I needed. Delivery was fast too.',
        is_featured: true,
        created_at: '2024-11-15',
    },
    {
        id: '2',
        customer_name: 'Engr. Chukwudi K.',
        rating: 5,
        content: 'Best pharmacy in Lekki! They always have my medication in stock and the prices are fair. Highly recommend.',
        is_featured: true,
        created_at: '2024-11-10',
    },
    {
        id: '3',
        customer_name: 'Dr. Amina B.',
        rating: 5,
        content: 'Professional service and genuine products. I trust Medomni for all my healthcare needs.',
        is_featured: true,
        created_at: '2024-10-28',
    },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`material-symbols-outlined text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
            >
                star
            </span>
        ))}
    </div>
);

const TestimonialsSection: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(STATIC_TESTIMONIALS);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const goToTestimonial = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">
                        Customer Reviews
                    </span>
                    <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Join thousands of satisfied customers who trust Medomni for quality healthcare products
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main testimonial */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                        {/* Quote icon */}
                        <div className="absolute top-6 left-6 text-primary/10 dark:text-primary/20">
                            <span className="material-symbols-outlined text-7xl">format_quote</span>
                        </div>

                        <div className="relative z-10">
                            {/* Content */}
                            <div className="min-h-[100px] mb-6">
                                <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed italic">
                                    "{testimonials[currentIndex]?.content}"
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {testimonials[currentIndex]?.customer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {testimonials[currentIndex]?.customer_name}
                                        </p>
                                        <StarRating rating={testimonials[currentIndex]?.rating || 5} />
                                    </div>
                                </div>

                                {/* Verified badge */}
                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>
                                        verified
                                    </span>
                                    <span className="font-medium">Verified Customer</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-primary w-8'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Previous testimonial"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Next testimonial"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {[
                        { value: '5,000+', label: 'Happy Customers' },
                        { value: '4.9', label: 'Average Rating' },
                        { value: '98%', label: 'Satisfaction Rate' },
                        { value: '24/7', label: 'Customer Support' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
