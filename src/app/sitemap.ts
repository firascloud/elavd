import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/home";

const BASE_URL = "https://elavd.com";
const LOCALES = ["en", "ar"];

type UrlEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
};

function withAlternates(path: string): UrlEntry[] {
  const p = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${BASE_URL}/${l}${p === "/" ? "" : p}`;
  }
  // Return one entry (any locale url is fine); alternates will include the others
  return [
    {
      url: languages["en"] ?? `${BASE_URL}/en${p === "/" ? "" : p}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages },
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: UrlEntry[] = [];

  // Static pages
  [
    "/", //
    "/about-us",
    "/store",
    "/contact-us",
    "/cart",
    "/compare",
    "/favorite",
  ].forEach((p) => entries.push(...withAlternates(p)));

  // Dynamic: Categories (product-category/[slug]) and map into store/[slug] as well
  try {
    const categories = await getCategories(1000);
    for (const c of categories || []) {
      const slug = c?.slug_en || c?.slug_ar || "";
      if (!slug) continue;
      entries.push(...withAlternates(`/product-category/${slug}`));
      entries.push(...withAlternates(`/store/${slug}`));
    }
  } catch {
    // ignore fetch errors
  }

  // Dynamic: Brands (brands/[slug])
  try {
    const { getBrands } = await import("@/services/brandService");
    const brands = await getBrands(1000);
    for (const b of brands || []) {
      const slug = b?.slug_en || b?.slug_ar || "";
      if (!slug) continue;
      entries.push(...withAlternates(`/store/${slug}`));
    }
    entries.push(...withAlternates("/brands"));
  } catch {
    // ignore fetch errors
  }

  // Dynamic: Products (product/[slug])
  try {
    const products = await getProducts({ limit: 1000 });
    for (const p of products || []) {
      const slug = (p as any)?.slug || (p as any)?.slug_en || (p as any)?.slug_ar || "";
      if (!slug) continue;
      entries.push(...withAlternates(`/product/${slug}`));
    }
  } catch {
    // ignore fetch errors
  }

  // Convert to Next sitemap shape (array)
  return entries as MetadataRoute.Sitemap;
}

