/**
 * Category Service
 * 
 * Handles all CRUD operations for product categories.
 * Connects to Supabase database.
 */

import { supabase } from '../lib/supabase';
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput
} from '../types/carousel';

const TABLE_NAME = 'categories';

export const categoryService = {
    /**
     * Get all active categories for public display
     * Returns categories ordered by display_order
     */
    async getActiveCategories(): Promise<Category[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('[CategoryService] Error fetching active categories:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[CategoryService] Exception in getActiveCategories:', err);
            return [];
        }
    },

    /**
     * Get all categories for admin management
     * Returns all categories (active and inactive) ordered by display_order
     */
    async getAllCategories(): Promise<Category[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                console.error('[CategoryService] Error fetching all categories:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[CategoryService] Exception in getAllCategories:', err);
            return [];
        }
    },

    /**
     * Get a single category by ID
     */
    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('[CategoryService] Error fetching category:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CategoryService] Exception in getCategoryById:', err);
            return null;
        }
    },

    /**
     * Check if a slug already exists
     */
    async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
        try {
            let query = supabase
                .from(TABLE_NAME)
                .select('id')
                .eq('slug', slug);

            if (excludeId) {
                query = query.neq('id', excludeId);
            }

            const { data, error } = await query.maybeSingle();

            if (error) {
                console.error('[CategoryService] Error checking slug:', error);
                return false;
            }

            return !!data;
        } catch (err) {
            console.error('[CategoryService] Exception in checkSlugExists:', err);
            return false;
        }
    },

    /**
     * Create a new category
     */
    async createCategory(input: CreateCategoryInput): Promise<Category | null> {
        try {
            // Check slug uniqueness
            const slugExists = await this.checkSlugExists(input.slug);
            if (slugExists) {
                console.error('[CategoryService] Slug already exists:', input.slug);
                return null;
            }

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert({
                    name: input.name,
                    slug: input.slug,
                    image_url: input.image_url,
                    description: input.description || null,
                    display_order: input.display_order ?? 0,
                    is_active: input.is_active ?? true,
                })
                .select()
                .single();

            if (error) {
                console.error('[CategoryService] Error creating category:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CategoryService] Exception in createCategory:', err);
            return null;
        }
    },

    /**
     * Update an existing category
     */
    async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
        try {
            // Check slug uniqueness if updating slug
            if (input.slug) {
                const slugExists = await this.checkSlugExists(input.slug, id);
                if (slugExists) {
                    console.error('[CategoryService] Slug already exists:', input.slug);
                    return null;
                }
            }

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(input)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('[CategoryService] Error updating category:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[CategoryService] Exception in updateCategory:', err);
            return null;
        }
    },

    /**
     * Delete a category
     */
    async deleteCategory(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) {
                console.error('[CategoryService] Error deleting category:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CategoryService] Exception in deleteCategory:', err);
            return false;
        }
    },

    /**
     * Toggle category active status
     */
    async toggleCategoryActive(id: string, isActive: boolean): Promise<Category | null> {
        return this.updateCategory(id, { is_active: isActive });
    },

    /**
     * Reorder categories
     */
    async reorderCategories(orderedIds: string[]): Promise<boolean> {
        try {
            const updates = orderedIds.map((id, index) =>
                supabase
                    .from(TABLE_NAME)
                    .update({ display_order: index })
                    .eq('id', id)
            );

            const results = await Promise.all(updates);
            const hasError = results.some(r => r.error);

            if (hasError) {
                console.error('[CategoryService] Error reordering categories');
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CategoryService] Exception in reorderCategories:', err);
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
            const filePath = `categories/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('category-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('[CategoryService] Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('category-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('[CategoryService] Exception in uploadImage:', err);
            return null;
        }
    },

    /**
     * Delete image from storage bucket
     */
    async deleteImage(imageUrl: string): Promise<boolean> {
        try {
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.indexOf('category-images');

            if (bucketIndex === -1) {
                return false;
            }

            const filePath = pathParts.slice(bucketIndex + 1).join('/');

            const { error } = await supabase.storage
                .from('category-images')
                .remove([filePath]);

            if (error) {
                console.error('[CategoryService] Error deleting image:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('[CategoryService] Exception in deleteImage:', err);
            return false;
        }
    },
};

export default categoryService;
