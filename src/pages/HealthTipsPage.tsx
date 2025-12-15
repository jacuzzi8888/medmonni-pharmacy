import React, { useState } from 'react';
import { ARTICLES } from '../data/articles';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    content?: string;
    author?: string;
    date?: string;
}

const HealthTipsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

    const categories = ['All', ...Array.from(new Set(ARTICLES.map((a: Article) => a.category)))];

    const filteredArticles = selectedCategory === 'All'
        ? ARTICLES
        : ARTICLES.filter((a: Article) => a.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary to-blue-800 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        Health Hub
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Health Tips & Wellness
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Expert advice and insights to help you live a healthier life.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
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

            {/* Articles Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article: Article) => (
                            <article
                                key={article.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                                onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
                                        {article.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-4 flex items-center text-primary font-semibold text-sm">
                                        <span>{expandedArticle === article.id ? 'Read Less' : 'Read More'}</span>
                                        <span className={`material-symbols-outlined text-[16px] ml-1 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                                {expandedArticle === article.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {article.content || article.excerpt}
                                        </p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-gradient-to-r from-primary to-blue-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Get Health Tips in Your Inbox
                    </h2>
                    <p className="text-white/80 mb-8">
                        Subscribe to our newsletter for weekly health tips and exclusive offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="px-6 py-3 bg-accent-red text-white font-bold rounded-full hover:bg-red-700 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HealthTipsPage;
