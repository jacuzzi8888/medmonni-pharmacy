import { supabase } from '../lib/supabase';

export interface NavigationLink {
    id: string;
    label: string;
    href: string;
    icon?: string;
    parent_id?: string;
    display_order: number;
    is_active: boolean;
    is_external: boolean;
    location: 'header' | 'footer' | 'mobile';
    created_at: string;
    updated_at: string;
    children?: NavigationLink[];
}

export type CreateNavLinkInput = Omit<NavigationLink, 'id' | 'created_at' | 'updated_at' | 'children'>;
export type UpdateNavLinkInput = Partial<CreateNavLinkInput>;

export const navigationService = {
    // Get navigation links by location (public)
    async getByLocation(location: NavigationLink['location']): Promise<NavigationLink[]> {
        const { data, error } = await supabase
            .from('navigation_links')
            .select('*')
            .eq('location', location)
            .eq('is_active', true)
            .is('parent_id', null)
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Get children for each parent
        const links = data || [];
        for (const link of links) {
            const { data: children } = await supabase
                .from('navigation_links')
                .select('*')
                .eq('parent_id', link.id)
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            link.children = children || [];
        }

        return links;
    },

    // Get header navigation
    async getHeader(): Promise<NavigationLink[]> {
        return this.getByLocation('header');
    },

    // Get footer navigation
    async getFooter(): Promise<NavigationLink[]> {
        return this.getByLocation('footer');
    },

    // Admin: Get all links
    async getAll(): Promise<NavigationLink[]> {
        const { data, error } = await supabase
            .from('navigation_links')
            .select('*')
            .order('location', { ascending: true })
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Admin: Create link
    async create(link: CreateNavLinkInput): Promise<NavigationLink> {
        const { data, error } = await supabase
            .from('navigation_links')
            .insert(link)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Update link
    async update(id: string, updates: UpdateNavLinkInput): Promise<NavigationLink> {
        const { data, error } = await supabase
            .from('navigation_links')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Delete link
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('navigation_links')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Reorder links
    async reorder(links: { id: string; display_order: number }[]): Promise<void> {
        for (const link of links) {
            await supabase
                .from('navigation_links')
                .update({ display_order: link.display_order })
                .eq('id', link.id);
        }
    },

    // Admin: Toggle active status
    async toggleActive(id: string, is_active: boolean): Promise<NavigationLink> {
        return this.update(id, { is_active });
    },
};

export default navigationService;
