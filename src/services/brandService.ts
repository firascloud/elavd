import { supabaseBrowser } from '@/lib/supabase/client';

export type Brand = {
    id: string;
    name_en: string | null;
    name_ar: string | null;
    brand_index_en?: string | null;
    brand_index_ar?: string | null;
    slug_en: string | null;
    slug_ar: string | null;
    image_url: string | null;
    created_at?: string;
    updated_at?: string;
};

export async function getBrands(limit: number = 100) {
    const { data, error } = await supabaseBrowser
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }

    return (data || []) as Brand[];
}

export async function getBrandBySlug(slug: string) {
    const { data, error } = await supabaseBrowser
        .from('brands')
        .select('*')
        .or(`slug_en.eq.${slug},slug_ar.eq.${slug}`)
        .maybeSingle();

    if (error) {
        console.error('Error fetching brand by slug:', error);
        return null;
    }

    return data as Brand | null;
}
