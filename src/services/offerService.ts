import { supabaseBrowser } from '@/lib/supabase/client';

export type Offer = {
    id: string;
    type: string;
    image_url: string;
    link: string;
    position: number;
    is_active: boolean;
};

export async function getOffers() {
    const { data } = await supabaseBrowser
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

    return (data || []) as Offer[];
}
