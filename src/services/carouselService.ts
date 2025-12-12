/**
 * Carousel Service
 * 
 * Handles all CRUD operations for carousel slides.
 * Connects to Supabase database.
 */

import { supabase } from '../lib/supabase';
import type {
    CarouselSlide,
    CreateCarouselSlideInput,
    UpdateCarouselSlideInput
} from '../types/carousel';

const TABLE_NAME = 'carousel_slides';

export const carouselService = {
    /**
     * Get all active slides for public display
     * Returns slides ordered by display_order
     */
    async getActiveSlides(): Promise<CarouselSlide[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('[CarouselService] Error fetching active slides:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[CarouselService] Exception in getActiveSlides:', err);
            return [];
        }
    },

    /**
     * Get all slides for admin management
     * Returns all slides (active and inactive) ordered by display_order
     */
    async getAllSlides(): Promise<CarouselSlide[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                console.error('[CarouselService] Error fetching all slides:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[CarouselService] Exception in getAllSlides:', err);
            return [];
        }
    },

    /**
     * Get a single slide by ID
     */
    async getSlideById(id: string): Promise<CarouselSlide | null> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('[CarouselService] Error fetching slide:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CarouselService] Exception in getSlideById:', err);
            return null;
        }
    },

    /**
     * Create a new carousel slide
     */
    async createSlide(input: CreateCarouselSlideInput): Promise<CarouselSlide | null> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert({
                    title: input.title,
                    subtitle: input.subtitle || null,
                    description: input.description || null,
                    image_url: input.image_url,
                    button_text: input.button_text || null,
                    button_link: input.button_link || null,
                    display_order: input.display_order ?? 0,
                    is_active: input.is_active ?? true,
                })
                .select()
                .single();

            if (error) {
                console.error('[CarouselService] Error creating slide:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CarouselService] Exception in createSlide:', err);
            return null;
        }
    },

    /**
     * Update an existing carousel slide
     */
    async updateSlide(id: string, input: UpdateCarouselSlideInput): Promise<CarouselSlide | null> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(input)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('[CarouselService] Error updating slide:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CarouselService] Exception in updateSlide:', err);
            return null;
        }
    },

    /**
     * Delete a carousel slide
     */
    async deleteSlide(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) {
                console.error('[CarouselService] Error deleting slide:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CarouselService] Exception in deleteSlide:', err);
            return false;
        }
    },

    /**
     * Toggle slide active status
     */
    async toggleSlideActive(id: string, isActive: boolean): Promise<CarouselSlide | null> {
        return this.updateSlide(id, { is_active: isActive });
    },

    /**
     * Reorder slides
     * Updates display_order for multiple slides
     */
    async reorderSlides(orderedIds: string[]): Promise<boolean> {
        try {
            // Update each slide with its new order
            const updates = orderedIds.map((id, index) =>
                supabase
                    .from(TABLE_NAME)
                    .update({ display_order: index })
                    .eq('id', id)
            );

            const results = await Promise.all(updates);
            const hasError = results.some(r => r.error);

            if (hasError) {
                console.error('[CarouselService] Error reordering slides');
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CarouselService] Exception in reorderSlides:', err);
            return false;
        }
    },

    /**
     * Upload image to storage bucket
     */
    async uploadImage(file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `carousel/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('carousel-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('[CarouselService] Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('carousel-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('[CarouselService] Exception in uploadImage:', err);
            return null;
        }
    },

    /**
     * Delete image from storage bucket
     */
    async deleteImage(imageUrl: string): Promise<boolean> {
        try {
            // Extract file path from URL
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.indexOf('carousel-images');

            if (bucketIndex === -1) {
                return false;
            }

            const filePath = pathParts.slice(bucketIndex + 1).join('/');

            const { error } = await supabase.storage
                .from('carousel-images')
                .remove([filePath]);

            if (error) {
                console.error('[CarouselService] Error deleting image:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CarouselService] Exception in deleteImage:', err);
            return false;
        }
    },
};

export default carouselService;
