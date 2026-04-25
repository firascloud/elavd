import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://giomurhtsumtshqcsxwd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb211cmh0c3VtdHNocWNzeHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjQ3MTYsImV4cCI6MjA5MDkwMDcxNn0.sCJzIgv-X1BwsEwXPspSc5Mkwua72-hh3CrDGmYHsOI'
);

async function fix() {
    console.log('Fixing category slugs...');
    const { data: cats } = await supabase.from('categories').select('id, slug_en, slug_ar');
    if (cats) {
        for (const cat of cats) {
            const newSlugEn = cat.slug_en?.trim();
            const newSlugAr = cat.slug_ar?.trim();
            if (newSlugEn !== cat.slug_en || newSlugAr !== cat.slug_ar) {
                console.log(`Updating category ${cat.id}: "${cat.slug_en}" -> "${newSlugEn}"`);
                await supabase.from('categories').update({ slug_en: newSlugEn, slug_ar: newSlugAr }).eq('id', cat.id);
            }
        }
    }

    console.log('Fixing sub-category slugs...');
    const { data: subCats } = await supabase.from('sub_categories').select('id, slug_en, slug_ar');
    if (subCats) {
        for (const sub of subCats) {
            const newSlugEn = sub.slug_en?.trim();
            const newSlugAr = sub.slug_ar?.trim();
            if (newSlugEn !== sub.slug_en || newSlugAr !== sub.slug_ar) {
                console.log(`Updating sub-category ${sub.id}: "${sub.slug_en}" -> "${newSlugEn}"`);
                await supabase.from('sub_categories').update({ slug_en: newSlugEn, slug_ar: newSlugAr }).eq('id', sub.id);
            }
        }
    }
    
    console.log('Done.');
}

fix();
