import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/home";
import { SITE_URL } from "@/config/site";

type UrlEntry = {
  url: string;
  lastModified?: Date;
};

/**
 * Emits one locale-free public URL. The selected language is stored in the
 * NEXT_LOCALE cookie and is intentionally not encoded in the path.
 */
function withAlternates(
  path: string,
  lastModified?: string,
): UrlEntry[] {
  const toAbsolute = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL}${p === "/" ? "" : p}`;
  };

  const localizedPath = path.startsWith("/") ? path : `/${path}`;

  return [{
    url: toAbsolute(localizedPath),
    ...(lastModified && !Number.isNaN(Date.parse(lastModified))
      ? { lastModified: new Date(lastModified) }
      : {}),
  }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: UrlEntry[] = [];

  // Static pages — cart/compare/favorite excluded (noindexed user-state pages)
  [
    "/",
    "/about-us",
    "/store",
    "/brands",
    "/contact-us",
    "/specials",
    "/delivery-information",
    "/partnerships",
    "/privacy-policy",
    "/refund-policy",
    "/store/money-counting-machines",
  ].forEach((p) =>
    entries.push(...withAlternates(p))
  );

  // Dynamic: Categories — canonical path is /store/[slug]
  // /product-category/[slug] intentionally excluded to prevent duplicate content
  try {
    const categories = await getCategories(1000);
    for (const c of categories || []) {
      const slugEn = c?.slug_en || "";
      if (!slugEn) continue;
      entries.push(...withAlternates(`/store/${slugEn}`, c.updated_at || c.created_at));
    }
  } catch (e) {
    console.error("[sitemap] categories fetch failed:", e);
  }

  // Dynamic: Brands (/store/[slug])
  try {
    const { getBrands } = await import("@/services/brandService");
    const brands = await getBrands(1000);
    for (const b of brands || []) {
      const slugEn = b?.slug_en || "";
      if (!slugEn) continue;
      entries.push(...withAlternates(`/store/${slugEn}`));
    }
  } catch (e) {
    console.error("[sitemap] brands fetch failed:", e);
  }

  // Dynamic: Products (/product/[slug])
  try {
    const products = await getProducts({ limit: 1000 });
    for (const p of products || []) {
      const slugEn = (p as any)?.slug_en || (p as any)?.slug || "";
      if (!slugEn) continue;
      entries.push(...withAlternates(`/product/${slugEn}`, p.updated_at || p.created_at));
    }
  } catch (e) {
    console.error("[sitemap] products fetch failed:", e);
  }

  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values()
  ) as MetadataRoute.Sitemap;
}
