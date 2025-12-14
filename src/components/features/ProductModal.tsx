import React, { useState } from "react";
import { useWishlist } from "../../contexts/WishlistContext";

interface ProductModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { isInWishlist, toggleWishlist } = useWishlist();

    const isWishlisted = product ? isInWishlist(product.id) : false;

    if (!isOpen || !product) return null;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Badge styling based on type
    const getBadgeStyles = (badge: string) => {
        const lowercaseBadge = badge.toLowerCase();
        if (lowercaseBadge.includes('best') || lowercaseBadge.includes('seller')) {
            return 'bg-gradient-to-r from-amber-500 to-yellow-400';
        }
        if (lowercaseBadge.includes('trend')) {
            return 'bg-gradient-to-r from-orange-500 to-red-500';
        }
        if (lowercaseBadge.includes('new')) {
            return 'bg-gradient-to-r from-green-500 to-emerald-400';
        }
        return 'bg-gradient-to-r from-primary to-blue-600';
    };

    return (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative min-h-screen md:min-h-0 flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110 hover:rotate-90"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Image Side */}
                    <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center relative overflow-hidden group">
                        {/* Badge */}
                        {product.badge && (
                            <span className={`absolute top-4 left-4 ${getBadgeStyles(product.badge)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10`}>
                                <span className="material-symbols-outlined text-[12px]">star</span>
                                {product.badge}
                            </span>
                        )}

                        {/* Image with zoom effect */}
                        <div className="relative">
                            {!imageLoaded && (
                                <div className="absolute inset-0 skeleton rounded-lg" />
                            )}
                            <img
                                src={product.img}
                                alt={product.name}
                                className={`w-full max-w-sm h-auto object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>

                        {/* Action buttons on image */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`p-3 rounded-full shadow-lg transition-all ${isWishlisted
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-red-500'
                                    } backdrop-blur-sm`}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? '"FILL" 1' : '"FILL" 0' }}>
                                    favorite
                                </span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg text-gray-500 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">share</span>
                            </button>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full overflow-y-auto max-h-[80vh]">
                        {/* Category */}
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-accent-red font-bold text-xs uppercase tracking-wider">{product.category || "Pharmacy"}</span>
                            {product.inStock !== false && (
                                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    In Stock
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h2>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                <span className="text-primary">₦</span>
                                {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {product.fullDescription || product.description}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">remove</span>
                                </button>
                                <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-3 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">medication</span> Dosage
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.dosage || "Consult a physician."}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">science</span> Ingredients
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.ingredients || "See package."}</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto space-y-4">
                            <a
                                href={product.paystackLink || product.paystack_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-center font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 btn-lift shimmer-overlay group"
                            >
                                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                Buy Now - ₦{typeof product.price === 'number' ? (product.price * quantity).toLocaleString() : product.price}
                                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </a>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                    Secure Payment
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                    Fast Delivery
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    Genuine Products
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

