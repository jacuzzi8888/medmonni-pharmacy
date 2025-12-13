import React, { useState, useEffect, useRef } from "react";
import { PRODUCTS } from "../../data/products";
import { ARTICLES } from "../../data/articles";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onProductClick: (product: any) => void;
    onArticleClick: (article: any) => void;
}

const POPULAR_TAGS = ["Vitamins", "Pain Relief", "Skincare", "First Aid", "Supplements"];

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onProductClick, onArticleClick }) => {
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save search to recent
    const saveSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        if (!isOpen) {
            setQuery("");
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const filteredProducts = query
        ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
        : [];

    const filteredArticles = query
        ? ARTICLES.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
        : [];

    const totalResults = filteredProducts.length + filteredArticles.length;

    const handleProductClick = (product: any) => {
        saveSearch(query);
        onClose();
        onProductClick(product);
    };

    const handleArticleClick = (article: any) => {
        saveSearch(query);
        onClose();
        onArticleClick(article);
    };

    const handleTagClick = (tag: string) => {
        setQuery(tag);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fade-in flex items-start justify-center pt-[10vh]">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Search Modal */}
            <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-in-down">
                {/* Search Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products, health tips..."
                        className="flex-1 text-lg bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-400 dark:text-gray-500">
                        ESC
                    </kbd>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {/* Empty State - Show recent searches and popular tags */}
                    {!query && (
                        <div className="p-5">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">history</span>
                                            Recent Searches
                                        </h3>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setQuery(search)}
                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">history</span>
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Tags */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                    Popular Searches
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagClick(tag)}
                                            className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Placeholder */}
                            <div className="text-center py-8 opacity-50">
                                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2 block">search</span>
                                <p className="text-sm text-gray-500">Start typing to search</p>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {query && totalResults === 0 && (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">search_off</span>
                            <p className="text-gray-500">No results found for "{query}"</p>
                            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                        </div>
                    )}

                    {/* Products Results */}
                    {filteredProducts.length > 0 && (
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">medication</span>
                                Products
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{filteredProducts.length}</span>
                            </h3>
                            <div className="space-y-2">
                                {filteredProducts.slice(0, 5).map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group w-full text-left"
                                    >
                                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={product.img || product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-1" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{product.name}</h4>
                                            <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-primary font-bold">{product.price}</p>
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-lg transition-colors">arrow_forward</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {filteredProducts.length > 5 && (
                                <p className="text-center text-sm text-gray-400 mt-3">
                                    +{filteredProducts.length - 5} more products
                                </p>
                            )}
                        </div>
                    )}

                    {/* Articles Results */}
                    {filteredArticles.length > 0 && (
                        <div className="p-5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">article</span>
                                Health Hub
                                <span className="bg-accent-red/10 text-accent-red px-2 py-0.5 rounded-full text-[10px]">{filteredArticles.length}</span>
                            </h3>
                            <div className="space-y-2">
                                {filteredArticles.slice(0, 3).map(article => (
                                    <button
                                        key={article.id}
                                        onClick={() => handleArticleClick(article)}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all w-full text-left group"
                                    >
                                        <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-accent-red">article</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-bold text-accent-red mb-0.5 block">{article.tag}</span>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{article.title}</h4>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with keyboard hints */}
                {query && totalResults > 0 && (
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{totalResults} result{totalResults !== 1 ? 's' : ''} found</span>
                            <div className="hidden sm:flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-[10px] shadow-sm">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-[10px] shadow-sm">↓</kbd>
                                    to navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-[10px] shadow-sm">Enter</kbd>
                                    to select
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;

