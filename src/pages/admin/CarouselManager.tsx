import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

interface CarouselSlide {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image_url: string;
    button_text: string | null;
    button_link: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const CarouselManager: React.FC = () => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        display_order: 0,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch slides
    const fetchSlides = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('carousel_slides')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching slides:', error);
        } else {
            setSlides(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // Upload image to Supabase Storage
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('carousel-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('carousel-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let image_url = formData.image_url;

        // Upload new image if selected
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (uploadedUrl) {
                image_url = uploadedUrl;
            } else {
                alert('Failed to upload image');
                setUploading(false);
                return;
            }
        }

        const slideData = {
            ...formData,
            image_url,
        };

        if (editingSlide) {
            // Update existing slide
            const { error } = await supabase
                .from('carousel_slides')
                .update(slideData)
                .eq('id', editingSlide.id);

            if (error) {
                console.error('Error updating slide:', error);
                alert('Failed to update slide');
            } else {
                alert('Slide updated successfully!');
                closeModal();
                fetchSlides();
            }
        } else {
            // Create new slide
            const { error } = await supabase
                .from('carousel_slides')
                .insert([slideData]);

            if (error) {
                console.error('Error creating slide:', error);
                alert('Failed to create slide');
            } else {
                alert('Slide created successfully!');
                closeModal();
                fetchSlides();
            }
        }

        setUploading(false);
    };

    // Delete slide
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        const { error } = await supabase
            .from('carousel_slides')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting slide:', error);
            alert('Failed to delete slide');
        } else {
            alert('Slide deleted successfully!');
            fetchSlides();
        }
    };

    // Toggle active status
    const toggleActive = async (slide: CarouselSlide) => {
        const { error } = await supabase
            .from('carousel_slides')
            .update({ is_active: !slide.is_active })
            .eq('id', slide.id);

        if (error) {
            console.error('Error toggling active status:', error);
        } else {
            fetchSlides();
        }
    };

    // Open modal for add/edit
    const openModal = (slide?: CarouselSlide) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle || '',
                description: slide.description || '',
                image_url: slide.image_url,
                button_text: slide.button_text || '',
                button_link: slide.button_link || '',
                display_order: slide.display_order,
                is_active: slide.is_active,
            });
            setImagePreview(slide.image_url);
        } else {
            setEditingSlide(null);
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                image_url: '',
                button_text: '',
                button_link: '',
                display_order: slides.length,
                is_active: true,
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
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
                            Carousel Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage homepage hero carousel slides
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Slide
                    </button>
                </div>

                {/* Slides List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
                    </div>
                ) : slides.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                            view_carousel
                        </span>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No slides yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Create your first carousel slide to get started
                        </p>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add First Slide
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                            >
                                {/* Slide Image */}
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={slide.image_url}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => toggleActive(slide)}
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${slide.is_active
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-500 text-white'
                                                }`}
                                        >
                                            {slide.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>

                                {/* Slide Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {slide.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {slide.subtitle}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            #{slide.display_order}
                                        </span>
                                    </div>

                                    {slide.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {slide.description}
                                        </p>
                                    )}

                                    {slide.button_text && (
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                                <strong>Button:</strong> {slide.button_text} → {slide.button_link}
                                            </span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(slide)}
                                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Slide Image *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        />
                                        {imagePreview && (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mt-4 w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Welcome to Medomni Pharmacy"
                                        />
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Your Health, Our Priority"
                                        />
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
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="Brief description..."
                                        />
                                    </div>

                                    {/* Button Text & Link */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Button Text
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.button_text}
                                                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                placeholder="e.g., Shop Now"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Button Link
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.button_link}
                                                onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                placeholder="e.g., /shop"
                                            />
                                        </div>
                                    </div>

                                    {/* Display Order & Active */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Display Order
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex items-center pt-8">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="w-5 h-5 text-primary"
                                            />
                                            <label className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Active
                                            </label>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {uploading ? 'Saving...' : editingSlide ? 'Update Slide' : 'Create Slide'}
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

export default CarouselManager;
