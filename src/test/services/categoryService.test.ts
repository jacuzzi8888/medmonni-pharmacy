/**
 * Category Service Tests - TDD
 * 
 * These tests define the expected behavior of the category service
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
            neq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
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

import { categoryService } from '../../services/categoryService';
import type { Category, CreateCategoryInput } from '../../types/carousel';

describe('CategoryService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getActiveCategories', () => {
        it('should return only active categories ordered by display_order', async () => {
            const { supabase } = await import('../../lib/supabase');

            const mockCategories: Category[] = [
                {
                    id: '1',
                    name: 'Wellness',
                    slug: 'wellness',
                    image_url: 'test.jpg',
                    display_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({
                            data: mockCategories,
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await categoryService.getActiveCategories();

            expect(result).toEqual(mockCategories);
            expect(supabase.from).toHaveBeenCalledWith('categories');
        });
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const { supabase } = await import('../../lib/supabase');

            const input: CreateCategoryInput = {
                name: 'New Category',
                slug: 'new-category',
                image_url: 'new.jpg',
            };

            const mockCreated: Category = {
                id: 'new-id',
                ...input,
                display_order: 0,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockSelectChain = {
                eq: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // Slug check returns null (not found)
                }),
            };

            const mockInsertChain = {
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: mockCreated,
                        error: null,
                    }),
                }),
            };

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue(mockSelectChain), // For checkSlugExists
                insert: vi.fn().mockReturnValue(mockInsertChain), // For createCategory
            } as any);

            const result = await categoryService.createCategory(input);

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

            const result = await categoryService.checkSlugExists('existing-slug');
            expect(result).toBe(true);
        });

        it('should return false if slug does not exist', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        maybeSingle: vi.fn().mockResolvedValue({
                            data: null,
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await categoryService.checkSlugExists('new-slug');
            expect(result).toBe(false);
        });
    });
});
