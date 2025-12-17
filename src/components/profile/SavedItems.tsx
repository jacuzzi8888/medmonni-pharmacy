import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { profileService } from '../../services/profileService';
import { SavedItem } from '../../types/profile';

const SavedItems: React.FC = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [items, setItems] = useState<SavedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'product' | 'article'>('all');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await profileService.getSavedItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching saved items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (item: SavedItem) => {
        try {
            await profileService.unsaveItem(item.item_type, item.item_id);
            setItems(prev => prev.filter(i => i.id !== item.id));
            success('Item removed from saved');
        } catch (error) {
            showError('Failed to remove item');
        }
    };

    const filteredItems = filter === 'all'
        ? items
        : items.filter(i => i.item_type === filter);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Items</h2>

                {/* Filter tabs */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {(['all', 'product', 'article'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === tab
                                    ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                                }`}
                        >
                            {tab === 'all' ? 'All' : tab === 'product' ? 'Products' : 'Articles'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">
                        favorite_border
                    </span>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? 'No saved items yet'
                            : `No saved ${filter}s`
                        }
                    </p>
                    <a
                        href={filter === 'article' ? '/health-tips' : '/shop'}
                        className="mt-4 inline-block text-primary font-medium hover:underline"
                    >
                        {filter === 'article' ? 'Browse Health Hub' : 'Browse Products'}
                    </a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-4"
                        >
                            {/* Placeholder icon */}
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${item.item_type === 'product'
                                    ? 'bg-primary/10'
                                    : 'bg-blue-500/10'
                                }`}>
                                <span className={`material-symbols-outlined text-2xl ${item.item_type === 'product'
                                        ? 'text-primary'
                                        : 'text-blue-500'
                                    }`}>
                                    {item.item_type === 'product' ? 'medication' : 'article'}
                                </span>
                            </div>

                            <div className="flex-1">
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full mb-1 ${item.item_type === 'product'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {item.item_type === 'product' ? 'Product' : 'Article'}
                                </span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Item ID: {item.item_id}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Saved {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={() => handleRemove(item)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove from saved"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedItems;
