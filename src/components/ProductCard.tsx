import React from 'react';

const ProductCard = ({ product, onQuickView }: { product: any, onQuickView: any }) => {
    const handleGatewayClick = (e: any) => {
        // Gateway Logic: Track conversion before redirect
        console.log(`[Gateway Analytics] User initiating redirect for Product: ${product.id}`);
        // In production, fire GTM/Analytics event here
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 dark:hover:border-gray-700 h-full">
            <div
                className="relative w-full h-56 bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer"
                onClick={() => onQuickView(product)}
            >
                {product.badge && (
                    <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        {product.badge}
                    </span>
                )}
                <div
                    className="w-full h-full bg-center bg-no-repeat bg-contain p-4 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                    style={{ backgroundImage: `url('${product.img}')` }}
                ></div>

                {/* Quick Overlay Action */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                    <span className="bg-white/90 text-gray-900 text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
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
                    <span className="text-xl font-bold text-primary dark:text-white">
                        {product.price}
                    </span>
                    {/* Gateway Action: Deep Link to Paystack */}
                    <a
                        href={product.paystackLink}
                        onClick={handleGatewayClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-accent-red text-white text-sm font-bold py-2.5 px-4 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-1 hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
                    >
                        <span>Buy Now</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
