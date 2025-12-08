import React, { useState } from 'react';
import { ARTICLES } from '../../data/articles';

const HealthHub = ({ onArticleClick }: { onArticleClick: (article: any) => void }) => {
    const [activeTab, setActiveTab] = useState("All");
    const categories = ["All", "Heart Health", "Wellness", "Nutrition"];

    const filteredArticles = activeTab === "All"
        ? ARTICLES
        : ARTICLES.filter(article => article.tag === activeTab);

    return (
        <div className="py-16 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-accent-red font-bold tracking-wider text-xs uppercase mb-2 block">The Blog</span>
                        <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-2">
                            The Health Hub
                        </h2>
                        <p className="text-gray-500">
                            Expert advice, wellness tips, and pharmacy updates.
                        </p>
                    </div>

                    {/* CMS Categories Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeTab === cat
                                    ? "bg-primary text-white border-primary"
                                    : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredArticles.map((article) => (
                        <article
                            key={article.id}
                            onClick={() => onArticleClick(article)}
                            className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="w-full h-48 overflow-hidden relative">
                                <div
                                    className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${article.img}')` }}
                                ></div>
                                <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-800 dark:text-white shadow-sm flex items-center gap-1">
                                    {article.isGated && (
                                        <span className="material-symbols-outlined text-[14px] text-accent-red">lock</span>
                                    )}
                                    {article.tag}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium">
                                    <span>{article.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary transition-colors mb-3 leading-snug">
                                    {article.title}
                                </h3>
                                <span className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:text-accent-red transition-colors group/link">
                                    Read Article <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HealthHub;
