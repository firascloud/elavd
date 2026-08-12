import "server-only";

import { unstable_cache } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import type { Category } from "@/services/categoryService";
import type { Product } from "@/services/productService";

const PRODUCT_CARD_FIELDS = [
  "id",
  "name_en",
  "name_ar",
  "slug_en",
  "slug_ar",
  "main_image",
  "short_desc_en",
  "short_desc_ar",
  "price",
  "discount_price",
  "is_featured",
  "is_popular",
  "category_id",
].join(",");

export const getStorefrontCategories = unstable_cache(
  async (limit = 16) => {
    const { data } = await getServerSupabase()
      .from("categories")
      .select("id,name_en,name_ar,slug_en,slug_ar,image_url,description_en,description_ar")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []).filter((category) => category.name_en || category.name_ar) as Category[];
  },
  ["storefront-categories"],
  { revalidate: 300, tags: ["categories"] },
);

export const getStorefrontProducts = unstable_cache(
  async (filter: "all" | "featured" | "popular", limit = 4) => {
    let query = getServerSupabase().from("products").select(PRODUCT_CARD_FIELDS);

    if (filter === "featured") query = query.eq("is_featured", true);
    if (filter === "popular") query = query.eq("is_popular", true);

    const { data } = await query
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []) as unknown as Product[];
  },
  ["storefront-products"],
  { revalidate: 300, tags: ["products"] },
);
