import { supabaseBrowser } from '@/lib/supabase/client';

export type SubCategory = {
    id: string;
    category_id: string;
    name_en: string | null;
    name_ar: string | null;
    slug_en: string | null;
    slug_ar: string | null;
    image_url: string | null;
    description_en: string | null;
    description_ar: string | null;
    created_at?: string;
    updated_at?: string;
};

export async function getSubCategories(limit: number = 100) {
    const { data } = await supabaseBrowser
        .from('sub_categories')
        .select('*, categories(name_en, name_ar)')
        .order('created_at', { ascending: false })
        .limit(limit);

    return (data || []) as (SubCategory & { categories: { name_en: string, name_ar: string } })[];
}

export async function getSubCategoriesByCategoryId(categoryId: string) {
    const { data } = await supabaseBrowser
        .from('sub_categories')
        .select('*')
        .eq('category_id', categoryId)
        .order('name_en', { ascending: true });

    return (data || []) as SubCategory[];
}

export async function getSubCategoryBySlug(slug: string) {
    const { data } = await supabaseBrowser
        .from('sub_categories')
        .select('*, categories(*)')
        .or(`slug_en.eq.${slug},slug_ar.eq.${slug}`)
        .maybeSingle();

    return data as (SubCategory & { categories: any }) | null;
}
