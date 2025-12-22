import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { PRODUCTS } from "../../data/products";
import SharePopup from "../common/SharePopup";

interface ArticleModalProps {
    article: any;
    isOpen: boolean;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const [isSaved, setIsSaved] = useState(() => {
        if (!article) return false;
        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        return saved.includes(article.id);
    });
    const [isShareOpen, setIsShareOpen] = useState(false);

    if (!isOpen || !article) return null;

    // Simulate cross-selling
    const relatedProduct = PRODUCTS.find(p => p.category === article.tag) || PRODUCTS[0];

    // Share URL for the article
    const shareUrl = `${window.location.origin}/health-tips?article=${article.id}`;

    // Open share popup
    const handleShare = () => {
        setIsShareOpen(true);
    };

    // Save/bookmark article functionality
    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');

        if (isSaved) {
            const updated = saved.filter((id: string | number) => id !== article.id);
            localStorage.setItem('savedArticles', JSON.stringify(updated));
            setIsSaved(false);
            toast.info('Article removed from saved');
        } else {
            saved.push(article.id);
            localStorage.setItem('savedArticles', JSON.stringify(saved));
            setIsSaved(true);
            toast.success('Article saved!');
        }
    };


    return (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative min-h-screen flex items-center justify-center p-0 md:p-4">
                <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                    <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-gray-800 dark:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Article Content */}
                    <div className="flex-1 overflow-y-auto max-h-[100vh] md:max-h-[90vh]">
                        <div className="h-64 md:h-80 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${article.img}')` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="bg-accent-red text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{article.tag}</span>
                                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">{article.title}</h2>
                                <div className="flex items-center gap-3 mt-4 text-gray-300 text-sm">
                                    <span>By {article.author}</span>
                                    <span>•</span>
                                    <span>{article.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="prose dark:prose-invert max-w-none relative">
                                {article.isGated && !isAuthenticated ? (
                                    <>
                                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 blur-sm select-none">
                                            {article.content.substring(0, 150)}...
                                        </p>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] z-10 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                                            <span className="material-symbols-outlined text-4xl text-accent-red mb-4">lock</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Member Only Content</h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                                                Sign in to read this full article and access exclusive health tips.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    const event = new CustomEvent('open-auth-modal');
                                                    window.dispatchEvent(event);
                                                }}
                                                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                                            >
                                                Sign In to Read
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                            {article.content}
                                        </p>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        </p>
                                        <h3 className="text-xl font-bold mt-6 mb-3 text-primary dark:text-white">Key Takeaways</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                            <li>Consistent routine is key.</li>
                                            <li>Hydration plays a major role in overall health.</li>
                                            <li>Consult a pharmacist before starting new supplements.</li>
                                        </ul>
                                        <p className="mt-6 text-gray-600 dark:text-gray-400">
                                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Share Section */}
                            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500 uppercase">Share this article</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                        title="Share article"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">share</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className={`p-2 rounded-full transition-colors ${isSaved
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                                        title={isSaved ? 'Remove from saved' : 'Save article'}
                                    >
                                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? '"FILL" 1' : '"FILL" 0' }}>bookmark</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Related Product (The "Funnel") */}
                    <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800/50 border-l border-gray-100 dark:border-gray-800 p-6 hidden md:flex flex-col">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Related Product</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 text-center">
                            <img src={relatedProduct.img} alt={relatedProduct.name} loading="lazy" className="w-32 h-32 mx-auto object-contain mb-4 mix-blend-multiply dark:mix-blend-normal" />
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{relatedProduct.name}</h4>
                            <p className="text-primary font-bold mb-4">{relatedProduct.price}</p>
                            <a href={relatedProduct.paystack_link} target="_blank" className="block w-full bg-accent-red text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Buy Now
                            </a>
                        </div>

                        <div className="mt-auto bg-primary/10 rounded-xl p-4">
                            <p className="text-sm text-primary font-medium mb-2">Need professional advice?</p>
                            <button className="text-xs font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                                Chat with Pharmacist <span className="material-symbols-outlined text-[14px]">chat</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Share Popup */}
            <SharePopup
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title={article.title}
                text={article.excerpt || article.content?.substring(0, 100)}
                url={shareUrl}
            />
        </div>
    );
};

export default ArticleModal;
