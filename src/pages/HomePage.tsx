import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/features/HeroCarousel';
import PharmacyServicesSection from '../components/features/PharmacyServicesSection';
import StoreInfoSection from '../components/features/StoreInfoSection';
import HealthHub from '../components/features/HealthHub';
import Newsletter from '../components/features/Newsletter';
import OutreachGallery from '../components/features/OutreachGallery';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';

interface HomePageProps {
    onProductClick: (product: any) => void;
    onArticleClick: (article: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onProductClick, onArticleClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const productsRef = useRef<HTMLDivElement>(null);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        // Scroll to products section
        setTimeout(() => {
            productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleClearFilter = () => {
        setSelectedCategory(null);
    };

    // Filter products by category
    const filteredProducts = selectedCategory
        ? PRODUCTS.filter(product => product.category === selectedCategory)
        : PRODUCTS;

    return (
        <>
            {/* Dynamic Campaign Carousel - Replaces Static Hero */}
            <HeroCarousel />

            {/* Shop by Category */}
            <div className="py-16 bg-white dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight">
                            Browse Departments
                        </h2>
                        <p className="mt-2 text-gray-500">Find exactly what you need for you and your family.</p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`group flex flex-col items-center gap-3 text-center cursor-pointer transition-all ${selectedCategory === category.name ? 'scale-105' : ''
                                    }`}
                            >
                                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm group-hover:shadow-md bg-white ${selectedCategory === category.name
                                    ? 'border-primary ring-4 ring-primary/20'
                                    : 'border-gray-100 dark:border-gray-800 group-hover:border-primary'
                                    }`}>
                                    <div
                                        className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-500"
                                        style={{ backgroundImage: `url('${category.img}')` }}
                                    ></div>
                                </div>
                                <p className={`text-sm sm:text-base font-medium transition-colors ${selectedCategory === category.name
                                    ? 'text-primary dark:text-primary font-bold'
                                    : 'text-gray-700 dark:text-gray-200 group-hover:text-primary'
                                    }`}>
                                    {category.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pharmacy Services - Milestone 3 */}
            <PharmacyServicesSection />

            {/* Featured Products - Gateway Mode */}
            <div ref={productsRef} className="py-20 bg-background-light dark:bg-background-dark/50 border-t border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-primary dark:text-white text-3xl font-bold tracking-tight">
                                {selectedCategory ? `${selectedCategory} Products` : 'Best Sellers'}
                            </h2>
                            <p className="mt-1 text-gray-500">
                                {selectedCategory
                                    ? `Showing ${filteredProducts.length} ${selectedCategory.toLowerCase()} products`
                                    : 'Customer favorites available for immediate delivery via Paystack.'
                                }
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={handleClearFilter}
                                    className="mt-3 inline-flex items-center text-sm text-accent-red font-semibold hover:text-red-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg mr-1">close</span>
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <Link to="/shop" className="hidden sm:flex items-center text-accent-red font-semibold hover:text-red-700 transition-colors">
                            View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
                        </Link>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={onProductClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">inventory_2</span>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No products found in this category.
                            </p>
                            <button
                                onClick={handleClearFilter}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Link to="/shop" className="text-accent-red font-semibold hover:text-red-700 inline-flex items-center">
                        View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Outreach Gallery - Phase 2 New Section */}
            <OutreachGallery />

            {/* Health Hub - SEO Engine with Tabs */}
            <HealthHub onArticleClick={onArticleClick} />

            {/* Newsletter / Lead Magnet - Functional */}
            <Newsletter />

            {/* Store Info - Milestone 2 */}
            <StoreInfoSection />
        </>
    );
};

export default HomePage;
