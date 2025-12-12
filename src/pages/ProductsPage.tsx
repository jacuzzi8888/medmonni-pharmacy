import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

interface ProductsPageProps {
    onProductClick: (product: any) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = PRODUCTS;

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'price-low') {
                const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
                return priceA - priceB;
            } else {
                const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
                return priceB - priceA;
            }
        });

        return sorted;
    }, [selectedCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">
                        Shop All Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Browse our complete catalog of pharmacy products
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 sticky top-4">
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Search Products
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name..."
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                                    />
                                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400">
                                        search
                                    </span>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        All Products ({PRODUCTS.length})
                                    </button>
                                    {CATEGORIES.map(category => {
                                        const count = PRODUCTS.filter(p => p.category === category.name).length;
                                        return (
                                            <button
                                                key={category.name}
                                                onClick={() => setSelectedCategory(category.name)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.name
                                                        ? 'bg-primary text-white'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {category.name} ({count})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedCategory || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSearchQuery('');
                                    }}
                                    className="w-full px-4 py-2 text-sm font-semibold text-accent-red border border-accent-red rounded-lg hover:bg-accent-red hover:text-white transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedProducts.length}</span> products
                            </p>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    Sort by:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={onProductClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">
                                    search_off
                                </span>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Try adjusting your filters or search query
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSearchQuery('');
                                    }}
                                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
