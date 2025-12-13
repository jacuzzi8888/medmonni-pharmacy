import React, { useState } from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleGatewayClick = (e: React.MouseEvent) => {
        // Gateway Logic: Track conversion before redirect
        console.log(`[Gateway Analytics] User initiating redirect for Product: ${product.id}`);
        // In production, fire GTM/Analytics event here
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    // Badge styling based on type
    const getBadgeStyles = (badge: string) => {
        const lowercaseBadge = badge.toLowerCase();
        if (lowercaseBadge.includes('best') || lowercaseBadge.includes('seller')) {
            return {
                bg: 'bg-gradient-to-r from-amber-500 to-yellow-400',
                icon: 'star',
            };
        }
        if (lowercaseBadge.includes('trend')) {
            return {
                bg: 'bg-gradient-to-r from-orange-500 to-red-500',
                icon: 'local_fire_department',
            };
        }
        if (lowercaseBadge.includes('new')) {
            return {
                bg: 'bg-gradient-to-r from-green-500 to-emerald-400',
                icon: 'new_releases',
            };
        }
        if (lowercaseBadge.includes('sale') || lowercaseBadge.includes('off')) {
            return {
                bg: 'bg-gradient-to-r from-red-600 to-pink-500',
                icon: 'percent',
            };
        }
        return {
            bg: 'bg-gradient-to-r from-primary to-blue-600',
            icon: 'verified',
        };
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden group flex flex-col h-full relative card-lift border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30">
            {/* Gradient top border accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-red to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div
                className="relative w-full h-56 bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer"
                onClick={() => {
                    console.log('[ProductCard] Quick view clicked for product:', product);
                    onQuickView(product);
                }}
            >
                {/* Badge with gradient and icon */}
                {product.badge && (
                    <span className={`absolute top-3 left-3 z-10 ${getBadgeStyles(product.badge).bg} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-fade-in`}>
                        <span className="material-symbols-outlined text-[12px]">{getBadgeStyles(product.badge).icon}</span>
                        {product.badge}
                    </span>
                )}

                {/* Wishlist Heart Button */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted
                            ? 'bg-red-500 text-white scale-100'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-500'
                        } shadow-md backdrop-blur-sm`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isWishlisted ? '"FILL" 1' : '"FILL" 0' }}>
                        favorite
                    </span>
                </button>

                {/* Product Image */}
                <div
                    className="w-full h-full bg-center bg-no-repeat bg-contain p-4 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                    style={{ backgroundImage: `url('${product.image}')` }}
                ></div>

                {/* Quick Overlay Action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
                    <span className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Quick View
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2 cursor-pointer" onClick={() => onQuickView(product)}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
                        {product.description}
                    </p>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800">
                    {/* Price with highlighted Naira symbol */}
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        <span className="text-primary">₦</span>
                        {product.price.toLocaleString()}
                    </span>
                    {/* Gateway Action: Deep Link to Paystack */}
                    <a
                        href={product.paystack_link}
                        onClick={handleGatewayClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-gradient-to-r from-accent-red to-red-600 text-white text-sm font-bold py-2.5 px-4 rounded-full hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-1.5 btn-lift shimmer-overlay group/btn"
                    >
                        <span>Buy Now</span>
                        <span className="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-x-0.5">arrow_forward</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

