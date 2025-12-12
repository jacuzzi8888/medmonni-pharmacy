/**
 * Carousel Types
 * Defines the data structures for carousel slides
 */

export interface CarouselSlide {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: string;
}

export interface CreateCarouselSlideInput {
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    display_order?: number;
    is_active?: boolean;
}

export interface UpdateCarouselSlideInput {
    title?: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    button_text?: string;
    button_link?: string;
    display_order?: number;
    is_active?: boolean;
}

// Category types for future use
export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    description?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: string;
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
    image_url: string;
    description?: string;
    display_order?: number;
    is_active?: boolean;
}

export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
    image_url?: string;
    description?: string;
    display_order?: number;
    is_active?: boolean;
}
