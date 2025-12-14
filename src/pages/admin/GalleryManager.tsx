import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { galleryService, GalleryImage, CreateGalleryImageInput } from '../../services/galleryService';

const GALLERY_CATEGORIES = ['General', 'Outreach', 'Services', 'Events', 'Team', 'Store'];
const GALLERY_SIZES = [
    { value: 'small', label: 'Small (1x1)', icon: 'crop_square' },
    { value: 'large', label: 'Large (2x2)', icon: 'crop_din' },
    { value: 'wide', label: 'Wide (2x1)', icon: 'crop_landscape' },
];

const GalleryManager: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [formData, setFormData] = useState<CreateGalleryImageInput>({
        title: '',
        caption: '',
        image_url: '',
        category: 'General',
        size: 'small',
        is_active: true,
        display_order: 0,
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setIsLoading(true);
            const data = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingImage) {
                await galleryService.update({ id: editingImage.id, ...formData });
            } else {
                await galleryService.create(formData);
            }
            await fetchImages();
            closeModal();
        } catch (error) {
            console.error('Error saving gallery image:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await galleryService.delete(id);
            await fetchImages();
        } catch (error) {
            console.error('Error deleting gallery image:', error);
        }
    };

    const handleToggleActive = async (image: GalleryImage) => {
        try {
            await galleryService.toggleActive(image.id, !image.is_active);
            await fetchImages();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const openModal = (image?: GalleryImage) => {
        if (image) {
            setEditingImage(image);
            setFormData({
                title: image.title,
                caption: image.caption || '',
                image_url: image.image_url,
                category: image.category,
                size: image.size,
                is_active: image.is_active,
                display_order: image.display_order,
            });
        } else {
            setEditingImage(null);
            setFormData({
                title: '',
                caption: '',
                image_url: '',
                category: 'General',
                size: 'small',
                is_active: true,
                display_order: images.length + 1,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingImage(null);
    };

    const filteredImages = filterCategory === 'all'
        ? images
        : images.filter(img => img.category === filterCategory);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Manager</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage community outreach and store photos
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                        Add Image
                    </button>
                </div>

                {/* Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterCategory === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        All ({images.length})
                    </button>
                    {GALLERY_CATEGORIES.map(cat => {
                        const count = images.filter(img => img.category === cat).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {cat} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Gallery Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-square skeleton rounded-xl" />
                        ))}
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">photo_library</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No images yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first gallery image</p>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Image
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map(image => (
                            <div
                                key={image.id}
                                className={`group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${!image.is_active ? 'opacity-50' : ''
                                    }`}
                            >
                                <div className="aspect-square">
                                    <img
                                        src={image.image_url}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-xs text-white/70 mb-1">{image.category}</span>
                                    <h3 className="text-white font-semibold text-sm truncate">{image.title}</h3>
                                    {image.caption && (
                                        <p className="text-white/70 text-xs truncate">{image.caption}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggleActive(image)}
                                        className={`p-2 rounded-lg ${image.is_active
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-500 text-white'
                                            }`}
                                        title={image.is_active ? 'Deactivate' : 'Activate'}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {image.is_active ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => openModal(image)}
                                        className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>

                                {/* Size badge */}
                                <div className="absolute top-2 left-2">
                                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        {image.size}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingImage ? 'Edit Image' : 'Add New Image'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Preview */}
                                {formData.image_url && (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Image title"
                                    />
                                </div>

                                {/* Caption */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Caption
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.caption}
                                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Optional caption"
                                    />
                                </div>

                                {/* Category & Size */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {GALLERY_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Size
                                        </label>
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value as 'small' | 'large' | 'wide' })}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {GALLERY_SIZES.map(size => (
                                                <option key={size.value} value={size.value}>{size.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Display Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Active Toggle */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-primary rounded"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Active (visible on website)</span>
                                </label>

                                {/* Submit */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        {editingImage ? 'Update' : 'Add Image'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default GalleryManager;
