import React, { useState, useEffect, useRef } from "react";
import { PRODUCTS } from "../../data/products";
import { ARTICLES } from "../../data/articles";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onProductClick: (product: any) => void;
    onArticleClick: (article: any) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onProductClick, onArticleClick }) => {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
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

    return (
        <div className="fixed inset-0 z-[60] bg-white/95 dark:bg-gray-900/98 backdrop-blur-xl transition-all duration-300 animate-fade-in flex flex-col">
            <div className="max-w-4xl mx-auto w-full px-4 pt-8">
                <div className="flex items-center gap-4 border-b-2 border-gray-200 dark:border-gray-700 pb-4">
                    <span className="material-symbols-outlined text-gray-400 text-3xl">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for medicine, health tips..."
                        className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-500 text-2xl">close</span>
                    </button>
                </div>

                <div className="mt-8 overflow-y-auto max-h-[80vh] pb-12">
                    {!query && (
                        <div className="text-center py-20 opacity-50">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">manage_search</span>
                            <p className="text-lg text-gray-500">Start typing to find products or health advice instantly.</p>
                        </div>
                    )}

                    {query && filteredProducts.length === 0 && filteredArticles.length === 0 && (
                        <p className="text-center text-gray-500 py-10">No results found for "{query}".</p>
                    )}

                    {filteredProducts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Products</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredProducts.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => {
                                            onClose();
                                            onProductClick(product);
                                        }}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 w-full text-left"
                                    >
                                        <img src={product.img} alt={product.name} className="w-16 h-16 object-contain mix-blend-multiply dark:mix-blend-normal bg-white rounded-md p-1" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h4>
                                            <p className="text-sm text-primary font-medium">{product.price}</p>
                                        </div>
                                        <span className="material-symbols-outlined ml-auto text-gray-300 group-hover:text-primary">visibility</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredArticles.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Health Hub</h3>
                            <div className="space-y-3">
                                {filteredArticles.map(article => (
                                    <button
                                        key={article.id}
                                        onClick={() => {
                                            onClose();
                                            onArticleClick(article);
                                        }}
                                        className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 w-full text-left"
                                    >
                                        <span className="text-xs font-bold text-accent-red mb-1 block">{article.tag}</span>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{article.title}</h4>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
