import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import AdminLayout from '../../components/admin/AdminLayout';
import type { Product, CreateProductInput } from '../../types/product';
import type { Category } from '../../types/carousel';

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // Form state
    const [formData, setFormData] = useState<CreateProductInput>({
        name: '',
        slug: '',
        price: 0,
        category: '',
        description: '',
        image: '',
        paystack_link: '',
        is_active: true,
        in_stock: true,
        is_featured: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                productService.getAllProducts(),
                categoryService.getAllCategories()
            ]);
            console.log('Fetched products:', productsData);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load products. Please refresh.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filtered Products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let image = formData.image;

            // Upload new image if selected
            if (imageFile) {
                const uploadedUrl = await productService.uploadImage(imageFile);
                if (uploadedUrl) {
                    image = uploadedUrl;
                } else {
                    alert('Failed to upload image. Please try again.');
                    setUploading(false);
                    return;
                }
            } else if (!image) {
                // Use default placeholder if no image provided or uploaded
                image = 'https://via.placeholder.com/400?text=No+Image';
            }

            const productData = {
                ...formData,
                image,
            };

            console.log('Submitting product data:', productData);

            if (editingProduct) {
                // Update existing product
                const updated = await productService.updateProduct(editingProduct.id, productData);
                if (updated) {
                    alert('Product updated successfully!');
                    closeModal();
                    fetchData();
                } else {
                    alert('Failed to update product. Please check console for details.');
                }
            } else {
                // Create new product
                const created = await productService.createProduct(productData);
                if (created) {
                    alert('Product created successfully!');
                    closeModal();
                    fetchData();
                } else {
                    alert('Failed to create product. Slug might already exist or database error.');
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An unexpected error occurred while saving.');
        } finally {
            setUploading(false);
        }
    };

    // Delete product
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const success = await productService.deleteProduct(id);
        if (success) {
            alert('Product deleted successfully!');
            fetchData();
        } else {
            alert('Failed to delete product.');
        }
    };

    // Toggle status
    const toggleStatus = async (product: Product, field: 'is_active' | 'in_stock' | 'is_featured') => {
        const updated = await productService.updateProduct(product.id, { [field]: !product[field] });
        if (updated) {
            fetchData();
        } else {
            alert('Failed to update status.');
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData({ ...formData, name, slug: editingProduct ? formData.slug : slug });
    };

    // Open modal for add/edit
    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                price: product.price,
                category: product.category,
                description: product.description || '',
                image: product.image,
                paystack_link: product.paystack_link,
                is_active: product.is_active,
                in_stock: product.in_stock,
                is_featured: product.is_featured,
            });
            setImagePreview(product.image);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                slug: '',
                price: 0,
                category: categories[0]?.name || '',
                description: '',
                image: '',
                paystack_link: '',
                is_active: true,
                in_stock: true,
                is_featured: false,
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview(null);
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Product Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage inventory, prices, and Paystack links
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Product
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Products List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                            inventory_2
                        </span>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {searchTerm || filterCategory !== 'All' ? 'Try adjusting your filters' : 'Create your first product to get started'}
                        </p>
                        {!searchTerm && filterCategory === 'All' && (
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Product</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                                        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono">/{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                ₦{product.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => toggleStatus(product, 'in_stock')}
                                                        className={`text-xs font-medium px-2 py-1 rounded w-fit ${product.in_stock
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            }`}
                                                    >
                                                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(product, 'is_featured')}
                                                        className={`text-xs font-medium px-2 py-1 rounded w-fit ${product.is_featured
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {product.is_featured ? 'Featured' : 'Standard'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => window.open(product.paystack_link, '_blank')}
                                                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Test Paystack Link"
                                                    >
                                                        <span className="material-symbols-outlined">shopping_cart</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(product)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column: Image */}
                                        <div className="lg:col-span-1 space-y-4">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Product Image
                                            </label>
                                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative group">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
                                                        <p className="text-xs text-gray-500">Click to upload image</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 text-center">
                                                Recommended: 800x800px JPG/PNG
                                            </p>
                                        </div>

                                        {/* Right Column: Details */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Name */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Product Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={handleNameChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                        placeholder="e.g., Paracetamol 500mg"
                                                    />
                                                </div>

                                                {/* Category */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Category *
                                                    </label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Price */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Price (₦) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                        required
                                                        min="0"
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>

                                                {/* Slug */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Slug (URL) *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.slug}
                                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Paystack Link */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Paystack Product Link *
                                                </label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">link</span>
                                                    <input
                                                        type="url"
                                                        value={formData.paystack_link}
                                                        onChange={(e) => setFormData({ ...formData, paystack_link: e.target.value })}
                                                        required
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                        placeholder="https://paystack.com/buy/..."
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Direct link to the product page on your Paystack Storefront.
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                    placeholder="Product details, dosage, warnings..."
                                                />
                                            </div>

                                            {/* Toggles */}
                                            <div className="flex gap-6 pt-2">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.in_stock}
                                                            onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">In Stock</span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.is_featured}
                                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Featured</span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.is_active}
                                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors shadow-lg shadow-primary/30"
                                        >
                                            {uploading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductManager;
