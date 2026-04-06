import { supabaseBrowser } from '@/lib/supabase/client';

export type Category = {
    id: string;
    name_en: string | null;
    name_ar: string | null;
    slug_en: string | null;
    slug_ar: string | null;
    image_url: string | null;
    description_en: string | null;
    description_ar: string | null;
    created_at?: string;
};

export async function getCategories(limit: number = 16) {
    const { data } = await supabaseBrowser
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    return (data || []).filter((c) => Boolean(c.name_en || c.name_ar)) as Category[];
}

export async function getCategoryBySlug(slug: string) {
    const { data } = await supabaseBrowser
        .from('categories')
        .select('*')
        .or(`slug_en.eq.${slug},slug_ar.eq.${slug}`)
        .single();

    return data as Category | null;
}
