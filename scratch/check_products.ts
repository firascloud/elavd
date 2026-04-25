import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://giomurhtsumtshqcsxwd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb211cmh0c3VtdHNocWNzeHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjQ3MTYsImV4cCI6MjA5MDkwMDcxNn0.sCJzIgv-X1BwsEwXPspSc5Mkwua72-hh3CrDGmYHsOI'
);

async function check() {
    const catId = '30cfda1c-1d79-4ce3-a330-5f4c4948ae3b'; // Money Counting Machines
    console.log(`Checking products for category ID: ${catId}`);
    
    const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', catId);
    
    if (error) console.error('Error:', error);
    else console.log(`Found ${count} products.`);

    console.log('\nSample products:');
    const { data: sample } = await supabase
        .from('products')
        .select('name_en, category_id')
        .limit(5);
    console.log(JSON.stringify(sample, null, 2));
}

check();
