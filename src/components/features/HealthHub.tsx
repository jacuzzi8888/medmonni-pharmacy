import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../../data/articles';
import { articleService, HealthArticle } from '../../services/articleService';

interface Category {
    name: string;
    icon: string;
}

// Map database article to component format
const mapArticle = (article: HealthArticle) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    img: article.image_url && article.image_url.trim() !== ''
        ? article.image_url
        : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    tag: article.category,
    date: new Date(article.published_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: `${article.read_time_minutes} min read`,
    content: article.content,
    excerpt: article.excerpt,
    isGated: false,
    isFeatured: article.is_featured,
});

const HealthHub = ({ onArticleClick }: { onArticleClick: (article: any) => void }) => {
    const [activeTab, setActiveTab] = useState("All");
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories: Category[] = [
        { name: "All", icon: "apps" },
        { name: "Heart Health", icon: "favorite" },
        { name: "Wellness", icon: "spa" },
        { name: "Nutrition", icon: "nutrition" },
    ];

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const dbArticles = await articleService.getPublished();
                if (dbArticles.length > 0) {
                    setArticles(dbArticles.map(mapArticle));
                } else {
                    // Fallback to static data if no database articles
                    setArticles(ARTICLES);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                // Fallback to static data on error
                setArticles(ARTICLES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const filteredArticles = activeTab === "All"
        ? articles
        : articles.filter(article => article.tag === activeTab);

    return (
        <div className="py-16 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-accent-red font-bold tracking-wider text-xs uppercase mb-2">
                            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                            The Blog
                        </span>
                        <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight mb-2">
                            The Health Hub
                        </h2>
                        <p className="text-gray-500">
                            Expert advice, wellness tips, and pharmacy updates.
                        </p>
                    </div>

                    {/* CMS Categories Tabs - Enhanced Pills */}
                    <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveTab(cat.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${activeTab === cat.name
                                    ? "bg-white dark:bg-gray-900 text-primary shadow-md"
                                    : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-primary"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[16px] transition-transform ${activeTab === cat.name ? 'scale-110' : ''}`}>
                                    {cat.icon}
                                </span>
                                <span className="hidden sm:inline">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading Skeleton */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                <div className="w-full h-48 skeleton" />
                                <div className="p-5 space-y-3">
                                    <div className="skeleton h-4 w-24 rounded" />
                                    <div className="skeleton h-6 w-full rounded" />
                                    <div className="skeleton h-4 w-20 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredArticles.map((article) => (
                            <article
                                key={article.id}
                                onClick={() => onArticleClick(article)}
                                className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/20 hover:-translate-y-2 cursor-pointer card-lift"
                            >
                                <div className="w-full h-48 overflow-hidden relative">
                                    <div
                                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${article.img}')` }}
                                    ></div>
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-gray-800 dark:text-white shadow-lg flex items-center gap-1.5">
                                        {article.isGated && (
                                            <span className="material-symbols-outlined text-[12px] text-accent-red">lock</span>
                                        )}
                                        {article.tag}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                            {article.date}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                                            {article.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary transition-colors mb-3 leading-snug line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <span className="mt-auto inline-flex items-center text-sm font-bold text-primary group-hover:text-accent-red transition-colors group/link">
                                        Read Article
                                        <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover:translate-x-2">arrow_forward</span>
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">article</span>
                        <p className="text-gray-500">No articles found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthHub;


