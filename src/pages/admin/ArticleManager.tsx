import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { articleService, HealthArticle, CreateHealthArticleInput } from '../../services/articleService';

const ArticleManager: React.FC = () => {
    const [articles, setArticles] = useState<HealthArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState<HealthArticle | null>(null);
    const [formData, setFormData] = useState<CreateHealthArticleInput>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: 'General',
        tags: [],
        author_name: 'Medomni Team',
        read_time_minutes: 5,
        is_featured: false,
        is_published: true,
        published_at: new Date().toISOString(),
    });

    const categories = ['General', 'Heart Health', 'Nutrition', 'Mental Health', 'Diabetes', 'First Aid', 'Women\'s Health', 'Men\'s Health', 'Child Health'];

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await articleService.getAll();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingArticle) {
                await articleService.update(editingArticle.id, formData);
            } else {
                await articleService.create(formData);
            }
            setShowModal(false);
            resetForm();
            fetchArticles();
        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            await articleService.delete(id);
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const handleTitleChange = (title: string) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData({ ...formData, title, slug });
    };

    const openEditModal = (article: HealthArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || '',
            content: article.content,
            image_url: article.image_url || '',
            category: article.category,
            tags: article.tags,
            author_name: article.author_name,
            read_time_minutes: article.read_time_minutes,
            is_featured: article.is_featured,
            is_published: article.is_published,
            published_at: article.published_at,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingArticle(null);
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image_url: '',
            category: 'General',
            tags: [],
            author_name: 'Medomni Team',
            read_time_minutes: 5,
            is_featured: false,
            is_published: true,
            published_at: new Date().toISOString(),
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Hub Articles</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage blog posts and health content</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-shadow"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Article
                    </button>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">article</span>
                        <p className="text-gray-500 mt-2">No articles yet</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 text-primary hover:underline"
                        >
                            Create your first article →
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {article.image_url && (
                                    <img src={article.image_url} alt={article.title} className="w-full h-40 object-cover" />
                                )}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-primary uppercase">{article.category}</span>
                                        {article.is_featured && (
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>
                                        )}
                                        {!article.is_published && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{article.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{article.read_time_minutes} min read</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(article)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingArticle ? 'Edit Article' : 'New Article'}
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Read Time (min)</label>
                                        <input
                                            type="number"
                                            value={formData.read_time_minutes}
                                            onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        rows={8}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_published}
                                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                                    </label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                                    >
                                        {editingArticle ? 'Update' : 'Create'} Article
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ArticleManager;
