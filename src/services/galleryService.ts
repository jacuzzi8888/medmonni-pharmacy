import { supabase } from '../lib/supabase';

export interface GalleryImage {
    id: string;
    title: string;
    caption: string | null;
    image_url: string;
    category: string;
    size: 'small' | 'large' | 'wide';
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface CreateGalleryImageInput {
    title: string;
    caption?: string;
    image_url: string;
    category?: string;
    size?: 'small' | 'large' | 'wide';
    is_active?: boolean;
    display_order?: number;
}

export interface UpdateGalleryImageInput extends Partial<CreateGalleryImageInput> {
    id: string;
}

export const galleryService = {
    /**
     * Get all gallery images (admin view - includes inactive)
     */
    async getAll(): Promise<GalleryImage[]> {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get active gallery images only (public view)
     */
    async getActive(): Promise<GalleryImage[]> {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get gallery images by category
     */
    async getByCategory(category: string): Promise<GalleryImage[]> {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get a single gallery image by ID
     */
    async getById(id: string): Promise<GalleryImage | null> {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new gallery image
     */
    async create(input: CreateGalleryImageInput): Promise<GalleryImage> {
        const { data, error } = await supabase
            .from('gallery_images')
            .insert([{
                title: input.title,
                caption: input.caption || null,
                image_url: input.image_url,
                category: input.category || 'General',
                size: input.size || 'small',
                is_active: input.is_active ?? true,
                display_order: input.display_order || 0,
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update an existing gallery image
     */
    async update(input: UpdateGalleryImageInput): Promise<GalleryImage> {
        const { id, ...updates } = input;

        const { data, error } = await supabase
            .from('gallery_images')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a gallery image
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('gallery_images')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Toggle active status
     */
    async toggleActive(id: string, isActive: boolean): Promise<GalleryImage> {
        const { data, error } = await supabase
            .from('gallery_images')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Reorder gallery images
     */
    async reorder(orderedIds: string[]): Promise<void> {
        const updates = orderedIds.map((id, index) => ({
            id,
            display_order: index + 1,
        }));

        for (const update of updates) {
            const { error } = await supabase
                .from('gallery_images')
                .update({ display_order: update.display_order })
                .eq('id', update.id);

            if (error) throw error;
        }
    },

    /**
     * Get all unique categories
     */
    async getCategories(): Promise<string[]> {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('category')
            .order('category');

        if (error) throw error;

        const categories = [...new Set(data?.map(item => item.category) || [])];
        return categories;
    },
};
