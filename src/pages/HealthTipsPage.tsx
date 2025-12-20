import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../data/articles';
import { articleService, HealthArticle } from '../services/articleService';
import ArticleModal from '../components/features/ArticleModal';

interface Article {
    id: number | string;
    title: string;
    excerpt: string;
    image: string;
    img?: string; // For modal compatibility
    category: string;
    tag?: string; // For modal compatibility
    content?: string;
    author?: string;
    date?: string;
}

// Map database article to component format
const mapArticle = (article: HealthArticle): Article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || '',
    image: article.image_url && article.image_url.trim() !== ''
        ? article.image_url
        : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    img: article.image_url && article.image_url.trim() !== ''
        ? article.image_url
        : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    category: article.category,
    tag: article.category,
    content: article.content,
    author: article.author_name || 'Medomni Team',
    date: new Date(article.published_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
});

const HealthTipsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const dbArticles = await articleService.getPublished();
                if (dbArticles.length > 0) {
                    setArticles(dbArticles.map(mapArticle));
                } else {
                    // Fallback to static data - map to our interface format
                    const staticMapped = ARTICLES.map(a => ({
                        id: a.id,
                        title: a.title,
                        excerpt: a.content || '',
                        image: a.img,
                        category: a.tag,
                        content: a.content,
                        author: a.author,
                        date: a.date,
                    }));
                    setArticles(staticMapped);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                // Map static data on error
                const staticMapped = ARTICLES.map(a => ({
                    id: a.id,
                    title: a.title,
                    excerpt: a.content || '',
                    image: a.img,
                    category: a.tag,
                    content: a.content,
                    author: a.author,
                    date: a.date,
                }));
                setArticles(staticMapped);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];

    const filteredArticles = selectedCategory === 'All'
        ? articles
        : articles.filter((a) => a.category === selectedCategory);

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
                        Health Hub
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
                                onClick={() => setSelectedArticle(article)}
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
                                        <span>Read More</span>
                                        <span className="material-symbols-outlined text-[16px] ml-1 transition-transform group-hover:translate-x-1">
                                            arrow_forward
                                        </span>
                                    </div>
                                </div>
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

            {/* Article Modal */}
            <ArticleModal
                article={selectedArticle}
                isOpen={!!selectedArticle}
                onClose={() => setSelectedArticle(null)}
            />
        </div>
    );
};

export default HealthTipsPage;
