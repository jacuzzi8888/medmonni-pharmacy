import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import AdminLayout from '../../components/admin/AdminLayout';
import type { Category, CreateCategoryInput } from '../../types/carousel';

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateCategoryInput>({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        display_order: 0,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch categories
    const fetchCategories = async () => {
        setIsLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let image_url = formData.image_url;

            // Upload new image if selected
            if (imageFile) {
                const uploadedUrl = await categoryService.uploadImage(imageFile);
                if (uploadedUrl) {
                    image_url = uploadedUrl;
                } else {
                    alert('Failed to upload image');
                    setUploading(false);
                    return;
                }
            }

            const categoryData = {
                ...formData,
                image_url,
            };

            if (editingCategory) {
                // Update existing category
                const updated = await categoryService.updateCategory(editingCategory.id, categoryData);
                if (updated) {
                    alert('Category updated successfully!');
                    closeModal();
                    fetchCategories();
                } else {
                    alert('Failed to update category. Slug might already exist.');
                }
            } else {
                // Create new category
                const created = await categoryService.createCategory(categoryData);
                if (created) {
                    alert('Category created successfully!');
                    closeModal();
                    fetchCategories();
                } else {
                    alert('Failed to create category. Slug might already exist.');
                }
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('An error occurred while saving.');
        } finally {
            setUploading(false);
        }
    };

    // Delete category
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        const success = await categoryService.deleteCategory(id);
        if (success) {
            alert('Category deleted successfully!');
            fetchCategories();
        } else {
            alert('Failed to delete category.');
        }
    };

    // Toggle active status
    const toggleActive = async (category: Category) => {
        const updated = await categoryService.toggleCategoryActive(category.id, !category.is_active);
        if (updated) {
            fetchCategories();
        } else {
            alert('Failed to toggle status.');
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
    };

    // Open modal for add/edit
    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                image_url: category.image_url,
                display_order: category.display_order,
                is_active: category.is_active,
            });
            setImagePreview(category.image_url);
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                image_url: '',
                display_order: categories.length,
                is_active: true,
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Category Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage product categories
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Category
                    </button>
                </div>

                {/* Categories List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                            category
                        </span>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No categories yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Create your first category to get started
                        </p>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add First Category
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group"
                            >
                                {/* Category Image */}
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                    {category.image_url ? (
                                        <img
                                            src={category.image_url}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="material-symbols-outlined text-4xl">image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => toggleActive(category)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${category.is_active
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-500 text-white'
                                                }`}
                                        >
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {category.name}
                                        </h3>
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            #{category.display_order}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
                                        /{category.slug}
                                    </p>

                                    {category.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={() => openModal(category)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h2>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Category Image
                                        </label>
                                        <div className="flex items-start gap-6">
                                            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative group">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="material-symbols-outlined text-4xl text-gray-400">add_photo_alternate</span>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500 mb-2">Upload a high-quality image for this category. Recommended size: 800x600px.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                                    className="text-sm text-primary font-semibold hover:underline"
                                                >
                                                    Choose Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={handleNameChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="e.g., Vitamins & Supplements"
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
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="e.g., vitamins-supplements"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="Brief description of this category..."
                                        />
                                    </div>

                                    {/* Display Order & Active */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Display Order
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex items-center pt-8">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                                            </label>
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
                                            {uploading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
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

export default CategoryManager;
