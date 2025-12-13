/**
 * Product Service
 * 
 * Handles all CRUD operations for products.
 * Connects to Supabase database.
 */

import { supabase } from '../lib/supabase';
import type {
    Product,
    CreateProductInput,
    UpdateProductInput
} from '../types/product';

const TABLE_NAME = 'products';

export const productService = {
    /**
     * Get all active products for public display
     */
    async getActiveProducts(): Promise<Product[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[ProductService] Error fetching active products:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[ProductService] Exception in getActiveProducts:', err);
            return [];
        }
    },

    /**
     * Get all products for admin management
     */
    async getAllProducts(): Promise<Product[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[ProductService] Error fetching all products:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('[ProductService] Exception in getAllProducts:', err);
            return [];
        }
    },

    /**
     * Get a single product by ID
     */
    async getProductById(id: string): Promise<Product | null> {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('[ProductService] Error fetching product:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[ProductService] Exception in getProductById:', err);
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
                console.error('[ProductService] Error checking slug:', error);
                return false;
            }

            return !!data;
        } catch (err) {
            console.error('[ProductService] Exception in checkSlugExists:', err);
            return false;
        }
    },

    /**
     * Create a new product
     */
    async createProduct(input: CreateProductInput): Promise<Product | null> {
        try {
            // Check slug uniqueness
            const slugExists = await this.checkSlugExists(input.slug);
            if (slugExists) {
                console.error('[ProductService] Slug already exists:', input.slug);
                return null;
            }

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert({
                    name: input.name,
                    slug: input.slug,
                    price: input.price,
                    category: input.category,
                    image: input.image,
                    description: input.description || null,
                    paystack_link: input.paystack_link,
                    is_active: input.is_active ?? true,
                    in_stock: input.in_stock ?? true,
                    is_featured: input.is_featured ?? false,
                })
                .select()
                .single();

            if (error) {
                console.error('[ProductService] Error creating product:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[ProductService] Exception in createProduct:', err);
            return null;
        }
    },

    /**
     * Update an existing product
     */
    async updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
        try {
            // Check slug uniqueness if updating slug
            if (input.slug) {
                const slugExists = await this.checkSlugExists(input.slug, id);
                if (slugExists) {
                    console.error('[ProductService] Slug already exists:', input.slug);
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
                console.error('[ProductService] Error updating product:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[ProductService] Exception in updateProduct:', err);
            return null;
        }
    },

    /**
     * Delete a product
     */
    async deleteProduct(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) {
                console.error('[ProductService] Error deleting product:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('[ProductService] Exception in deleteProduct:', err);
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
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('[ProductService] Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('[ProductService] Exception in uploadImage:', err);
            return null;
        }
    },
};

export default productService;
