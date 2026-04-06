import { supabaseBrowser } from '@/lib/supabase/client';

export type Product = {
    id: string;
    name_en: string | null;
    name_ar: string | null;
    slug_en: string | null;
    slug_ar: string | null;
    main_image: string | null;
    short_desc_en: string | null;
    short_desc_ar: string | null;
    full_desc_en?: string | null;
    full_desc_ar?: string | null;
    price?: number | null;
    discount_price?: number | null;
    is_featured?: boolean;
    is_popular?: boolean;
    is_event?: boolean;
    is_active?: boolean;
    created_at?: string;
    category_id?: string;
};

export async function getProducts({ 
    is_featured, 
    is_popular, 
    categoryId,
    limit = 20 
}: { 
    is_featured?: boolean, 
    is_popular?: boolean, 
    categoryId?: string,
    limit?: number 
}) {
    let query = supabaseBrowser.from('products').select('*');
    
    if (is_featured) query = query.eq('is_featured', true);
    if (is_popular) query = query.eq('is_popular', true);
    if (categoryId) query = query.eq('category_id', categoryId);
    
    const { data } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

    return (data || []) as Product[];
}

export async function getFeaturedProducts(limit: number = 4) {
    return getProducts({ is_featured: true, limit });
}
