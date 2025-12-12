import React from "react";

interface ProductModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative min-h-screen md:min-h-0 flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">

                    <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Image Side */}
                    <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center">
                        <img src={product.img} alt={product.name} className="w-full max-w-sm h-auto object-contain mix-blend-multiply dark:mix-blend-normal transform hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Details Side */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col h-full overflow-y-auto max-h-[80vh]">
                        <div className="mb-1">
                            <span className="text-accent-red font-bold text-xs uppercase tracking-wider">{product.category || "Pharmacy"}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-bold text-primary dark:text-primary">{product.price}</span>
                            {product.badge && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">{product.badge}</span>}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {product.fullDescription || product.description}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">medication</span> Dosage
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.dosage || "Consult a physician."}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">science</span> Ingredients
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.ingredients || "See package."}</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <a
                                href={product.paystackLink}
                                target="_blank"
                                className="w-full block bg-accent-red text-white text-center font-bold py-4 rounded-xl hover:bg-red-700 transition-all hover:shadow-lg transform hover:-translate-y-1"
                            >
                                Proceed to Checkout on Paystack
                            </a>
                            <p className="text-center text-xs text-gray-400 mt-3">
                                <span className="material-symbols-outlined text-[12px] align-middle">lock</span> Secure transaction processed by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
