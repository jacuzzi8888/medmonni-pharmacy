/**
 * Product Service Tests - TDD
 * 
 * These tests define the expected behavior of the product service
 * before implementation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before importing service
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            single: vi.fn(),
            maybeSingle: vi.fn(),
        }),
        storage: {
            from: vi.fn().mockReturnValue({
                upload: vi.fn(),
                getPublicUrl: vi.fn(),
                remove: vi.fn(),
            }),
        },
    },
}));

import { productService } from '../../services/productService';
import type { Product, CreateProductInput } from '../../types/product';

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getActiveProducts', () => {
        it('should return only active products', async () => {
            const { supabase } = await import('../../lib/supabase');

            const mockProducts: Product[] = [
                {
                    id: '1',
                    name: 'Product 1',
                    slug: 'product-1',
                    price: 100,
                    category: 'Wellness',
                    image: 'test.jpg',
                    description: 'Test',
                    is_active: true,
                    in_stock: true,
                    is_featured: false,
                    paystack_link: 'https://paystack.com/buy/test',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({
                            data: mockProducts,
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await productService.getActiveProducts();

            expect(result).toEqual(mockProducts);
            expect(supabase.from).toHaveBeenCalledWith('products');
        });
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const { supabase } = await import('../../lib/supabase');

            const input: CreateProductInput = {
                name: 'New Product',
                slug: 'new-product',
                price: 150,
                category: 'Skincare',
                image: 'new.jpg',
                description: 'New Description',
                paystack_link: 'https://paystack.com/buy/new',
            };

            const mockCreated: Product = {
                id: 'new-id',
                ...input,
                is_active: true,
                in_stock: true,
                is_featured: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // Mock slug check (returns null = not found)
            const mockSelectChain = {
                eq: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
            };

            // Mock insert
            const mockInsertChain = {
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: mockCreated,
                        error: null,
                    }),
                }),
            };

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue(mockSelectChain),
                insert: vi.fn().mockReturnValue(mockInsertChain),
            } as any);

            const result = await productService.createProduct(input);

            expect(result).toEqual(mockCreated);
        });
    });

    describe('checkSlugExists', () => {
        it('should return true if slug exists', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        maybeSingle: vi.fn().mockResolvedValue({
                            data: { id: '1' },
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await productService.checkSlugExists('existing-slug');
            expect(result).toBe(true);
        });
    });
});
