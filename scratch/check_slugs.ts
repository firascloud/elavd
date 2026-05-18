import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://giomurhtsumtshqcsxwd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb211cmh0c3VtdHNocWNzeHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjQ3MTYsImV4cCI6MjA5MDkwMDcxNn0.sCJzIgv-X1BwsEwXPspSc5Mkwua72-hh3CrDGmYHsOI'
);

async function check() {
    console.log('Checking categories...');
    const { data: cats, error: catError } = await supabase
        .from('categories')
        .select('id, name_en, slug_en, slug_ar');
    
    if (catError) console.error('Cat Error:', catError);
    else console.log('Categories:', JSON.stringify(cats, null, 2));

    console.log('\nChecking sub-categories...');
    const { data: subCats, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name_en, slug_en, slug_ar');
    
    if (subCatError) console.error('SubCat Error:', subCatError);
    else console.log('Sub-categories:', JSON.stringify(subCats, null, 2));
}

check();
