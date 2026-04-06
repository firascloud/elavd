const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://giomurhtsumtshqcsxwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb211cmh0c3VtdHNocWNzeHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjQ3MTYsImV4cCI6MjA5MDkwMDcxNn0.sCJzIgv-X1BwsEwXPspSc5Mkwua72-hh3CrDGmYHsOI"
);

async function main() {
  const slug = process.argv[2] || "plastic-cards";
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const filter = isUuid
    ? `slug_en.eq.${slug},slug_ar.eq.${slug},id.eq.${slug}`
    : `slug_en.eq.${slug},slug_ar.eq.${slug}`;

  const { data, error } = await supabase
    .from("products")
    .select("id,name_en,name_ar,slug_en,slug_ar,category_id,is_active")
    .or(filter);

  console.log(
    JSON.stringify({ slug, error: error || null, count: (data || []).length, data }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

