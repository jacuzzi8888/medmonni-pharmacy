import { supabase } from '../lib/supabase';

export interface HealthArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    image_url?: string;
    category: string;
    tags: string[];
    author_name: string;
    read_time_minutes: number;
    is_featured: boolean;
    is_published: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export type CreateHealthArticleInput = Omit<HealthArticle, 'id' | 'created_at' | 'updated_at'>;
export type UpdateHealthArticleInput = Partial<CreateHealthArticleInput>;

export const articleService = {
    // Get all published articles
    async getPublished(): Promise<HealthArticle[]> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get featured articles
    async getFeatured(): Promise<HealthArticle[]> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('*')
            .eq('is_published', true)
            .eq('is_featured', true)
            .order('published_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        return data || [];
    },

    // Get articles by category
    async getByCategory(category: string): Promise<HealthArticle[]> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('*')
            .eq('is_published', true)
            .eq('category', category)
            .order('published_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get single article by slug
    async getBySlug(slug: string): Promise<HealthArticle | null> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    // Admin: Get all articles (including unpublished)
    async getAll(): Promise<HealthArticle[]> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Admin: Create article
    async create(article: CreateHealthArticleInput): Promise<HealthArticle> {
        const { data, error } = await supabase
            .from('health_articles')
            .insert(article)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Update article
    async update(id: string, updates: UpdateHealthArticleInput): Promise<HealthArticle> {
        const { data, error } = await supabase
            .from('health_articles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Delete article
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('health_articles')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get unique categories
    async getCategories(): Promise<string[]> {
        const { data, error } = await supabase
            .from('health_articles')
            .select('category')
            .eq('is_published', true);

        if (error) throw error;
        const categories = [...new Set(data?.map(a => a.category) || [])];
        return categories;
    },
};

export default articleService;
