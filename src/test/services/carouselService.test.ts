/**
 * Carousel Service Tests - TDD
 * 
 * These tests define the expected behavior of the carousel service
 * before implementation (Test-Driven Development).
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

import { carouselService } from '../../services/carouselService';
import type { CarouselSlide, CreateCarouselSlideInput } from '../../types/carousel';

describe('CarouselService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getActiveSlides', () => {
        it('should return only active slides ordered by display_order', async () => {
            const { supabase } = await import('../../lib/supabase');

            const mockSlides: CarouselSlide[] = [
                {
                    id: '1',
                    title: 'Slide 1',
                    image_url: 'https://example.com/1.jpg',
                    display_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'Slide 2',
                    image_url: 'https://example.com/2.jpg',
                    display_order: 2,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({
                            data: mockSlides,
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.getActiveSlides();

            expect(result).toEqual(mockSlides);
            expect(supabase.from).toHaveBeenCalledWith('carousel_slides');
        });

        it('should return empty array when no slides exist', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({
                            data: [],
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.getActiveSlides();

            expect(result).toEqual([]);
        });

        it('should return empty array on database error', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({
                            data: null,
                            error: { message: 'Database error' },
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.getActiveSlides();

            expect(result).toEqual([]);
        });
    });

    describe('getAllSlides', () => {
        it('should return all slides for admin view', async () => {
            const { supabase } = await import('../../lib/supabase');

            const mockSlides: CarouselSlide[] = [
                {
                    id: '1',
                    title: 'Active Slide',
                    image_url: 'https://example.com/1.jpg',
                    display_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'Inactive Slide',
                    image_url: 'https://example.com/2.jpg',
                    display_order: 2,
                    is_active: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            vi.mocked(supabase.from).mockReturnValue({
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({
                        data: mockSlides,
                        error: null,
                    }),
                }),
            } as any);

            const result = await carouselService.getAllSlides();

            expect(result).toHaveLength(2);
            expect(result[1].is_active).toBe(false);
        });
    });

    describe('createSlide', () => {
        it('should create a new slide successfully', async () => {
            const { supabase } = await import('../../lib/supabase');

            const input: CreateCarouselSlideInput = {
                title: 'New Slide',
                image_url: 'https://example.com/new.jpg',
                button_text: 'Shop Now',
                button_link: '/shop',
            };

            const mockCreated: CarouselSlide = {
                id: 'new-id',
                ...input,
                display_order: 0,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            vi.mocked(supabase.from).mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({
                            data: mockCreated,
                            error: null,
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.createSlide(input);

            expect(result).toEqual(mockCreated);
        });

        it('should return null on creation error', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({
                            data: null,
                            error: { message: 'Insert failed' },
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.createSlide({
                title: 'Test',
                image_url: 'test.jpg',
            });

            expect(result).toBeNull();
        });
    });

    describe('updateSlide', () => {
        it('should update an existing slide', async () => {
            const { supabase } = await import('../../lib/supabase');

            const mockUpdated: CarouselSlide = {
                id: 'slide-1',
                title: 'Updated Title',
                image_url: 'https://example.com/1.jpg',
                display_order: 1,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            vi.mocked(supabase.from).mockReturnValue({
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        select: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({
                                data: mockUpdated,
                                error: null,
                            }),
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.updateSlide('slide-1', {
                title: 'Updated Title',
            });

            expect(result?.title).toBe('Updated Title');
        });
    });

    describe('deleteSlide', () => {
        it('should delete a slide successfully', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                delete: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({
                        error: null,
                    }),
                }),
            } as any);

            const result = await carouselService.deleteSlide('slide-1');

            expect(result).toBe(true);
        });

        it('should return false on delete error', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                delete: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({
                        error: { message: 'Delete failed' },
                    }),
                }),
            } as any);

            const result = await carouselService.deleteSlide('slide-1');

            expect(result).toBe(false);
        });
    });

    describe('toggleSlideActive', () => {
        it('should toggle slide active status', async () => {
            const { supabase } = await import('../../lib/supabase');

            vi.mocked(supabase.from).mockReturnValue({
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        select: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({
                                data: { id: '1', is_active: false },
                                error: null,
                            }),
                        }),
                    }),
                }),
            } as any);

            const result = await carouselService.toggleSlideActive('1', false);

            expect(result?.is_active).toBe(false);
        });
    });
});
