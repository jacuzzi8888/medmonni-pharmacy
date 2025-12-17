import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/features/HeroCarousel';
import PharmacyServicesSection from '../components/features/PharmacyServicesSection';
import StoreInfoSection from '../components/features/StoreInfoSection';
import HealthHub from '../components/features/HealthHub';
import Newsletter from '../components/features/Newsletter';
import TestimonialsSection from '../components/features/TestimonialsSection';
import OutreachGallery from '../components/features/OutreachGallery';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import type { Product } from '../types/product';

interface HomePageProps {
    onProductClick: (product: Product) => void;
    onArticleClick: (article: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onProductClick, onArticleClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const productsRef = useRef<HTMLDivElement>(null);

    // Fetch categories and products from DB
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingCategories(true);
            setIsLoadingProducts(true);
            try {
                const [dbCategories, dbProducts] = await Promise.all([
                    categoryService.getActiveCategories(),
                    productService.getActiveProducts()
                ]);

                // Handle Categories
                if (dbCategories.length > 0) {
                    const displayCategories = dbCategories.map(cat => ({
                        name: cat.name,
                        img: cat.image_url,
                        slug: cat.slug
                    }));
                    setCategories(displayCategories);
                } else {
                    setCategories(CATEGORIES);
                }

                // Handle Products
                if (dbProducts.length > 0) {
                    setProducts(dbProducts);
                } else {
                    // Fallback to static data with mapping
                    const mappedProducts: Product[] = PRODUCTS.map(p => ({
                        id: p.id,
                        name: p.name,
                        slug: p.id, // Fallback slug
                        price: parseInt(p.price.replace(/[^0-9]/g, '')),
                        category: p.category,
                        image: p.img,
                        description: p.description,
                        paystack_link: p.paystackLink,
                        is_active: true,
                        in_stock: true,
                        is_featured: false,
                        badge: p.badge
                    }));
                    setProducts(mappedProducts);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setCategories(CATEGORIES);
                // Fallback mapping on error
                const mappedProducts: Product[] = PRODUCTS.map(p => ({
                    id: p.id,
                    name: p.name,
                    slug: p.id,
                    price: parseInt(p.price.replace(/[^0-9]/g, '')),
                    category: p.category,
                    image: p.img,
                    description: p.description,
                    paystack_link: p.paystackLink,
                    is_active: true,
                    in_stock: true,
                    is_featured: false,
                    badge: p.badge
                }));
                setProducts(mappedProducts);
            } finally {
                setIsLoadingCategories(false);
                setIsLoadingProducts(false);
            }
        };

        fetchData();
    }, []);

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
        ? products.filter(product => product.category === selectedCategory)
        : products;

    return (
        <>
            {/* Dynamic Campaign Carousel - Replaces Static Hero */}
            <HeroCarousel />

            {/* Shop by Category */}
            <div className="py-8 md:py-16 bg-white dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 md:mb-10">
                        <h2 className="text-primary dark:text-white text-xl md:text-3xl font-bold tracking-tight">
                            Browse Categories
                        </h2>
                        <p className="mt-1 md:mt-2 text-gray-500 text-sm md:text-base">Find exactly what you need for you and your family.</p>
                    </div>

                    {isLoadingCategories ? (
                        <div className="flex justify-center py-8 md:py-12">
                            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-4 border-primary"></div>
                        </div>
                    ) : (
                        /* Horizontal scroll on mobile, grid on desktop */
                        <div className="flex md:grid md:grid-cols-6 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className={`group flex flex-col items-center gap-2 md:gap-3 text-center cursor-pointer transition-all flex-shrink-0 ${selectedCategory === category.name ? 'scale-105' : ''
                                        }`}
                                >
                                    <div className={`w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm group-hover:shadow-md bg-white ${selectedCategory === category.name
                                        ? 'border-primary ring-4 ring-primary/20'
                                        : 'border-gray-100 dark:border-gray-800 group-hover:border-primary'
                                        }`}>
                                        <div
                                            className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-500"
                                            style={{ backgroundImage: `url('${category.img}')` }}
                                        ></div>
                                    </div>
                                    <p className={`text-xs md:text-sm lg:text-base font-medium transition-colors whitespace-nowrap ${selectedCategory === category.name
                                        ? 'text-primary dark:text-primary font-bold'
                                        : 'text-gray-700 dark:text-gray-200 group-hover:text-primary'
                                        }`}>
                                        {category.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pharmacy Services - Milestone 3 */}
            <PharmacyServicesSection />

            {/* Featured Products - Gateway Mode */}
            <div ref={productsRef} className="py-10 md:py-20 bg-background-light dark:bg-background-dark/50 border-t border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-4 md:mb-8">
                        <div>
                            <h2 className="text-primary dark:text-white text-xl md:text-3xl font-bold tracking-tight">
                                {selectedCategory ? `${selectedCategory} Products` : 'Best Sellers'}
                            </h2>
                            <p className="mt-1 text-gray-500 text-sm md:text-base">
                                {selectedCategory
                                    ? `Showing ${filteredProducts.length} ${selectedCategory.toLowerCase()} products`
                                    : 'Customer favorites available for immediate delivery via Paystack.'
                                }
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={handleClearFilter}
                                    className="mt-2 md:mt-3 inline-flex items-center text-xs md:text-sm text-accent-red font-semibold hover:text-red-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base md:text-lg mr-1">close</span>
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <Link to="/shop" className="hidden sm:flex items-center text-accent-red font-semibold hover:text-red-700 transition-colors">
                            View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
                        </Link>
                    </div>

                    {isLoadingProducts ? (
                        <div className="flex justify-center py-8 md:py-12">
                            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-4 border-primary"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 h-full">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={onProductClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 md:py-12">
                            <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-300 dark:text-gray-700 mb-4">inventory_2</span>
                            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                                No products found in this category.
                            </p>
                            <button
                                onClick={handleClearFilter}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm md:text-base"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-6 md:mt-10 text-center sm:hidden">
                    <Link to="/shop" className="text-accent-red font-semibold hover:text-red-700 inline-flex items-center text-sm">
                        View All Products <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Outreach Gallery - Phase 2 New Section */}
            <OutreachGallery />

            {/* Health Hub - SEO Engine with Tabs */}
            <HealthHub onArticleClick={onArticleClick} />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Newsletter / Lead Magnet - Functional */}
            <Newsletter />

            {/* Store Info - Milestone 2 */}
            <StoreInfoSection />
        </>
    );
};

export default HomePage;
