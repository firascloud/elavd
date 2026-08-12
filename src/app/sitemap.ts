import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/home";

const BASE_URL = "https://elavd.com";
type UrlEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

/**
 * Emits one locale-free public URL. The selected language is stored in the
 * NEXT_LOCALE cookie and is intentionally not encoded in the path.
 */
function withAlternates(
  enPath: string,
  _arPath?: string,
  opts?: { priority?: number; changeFrequency?: UrlEntry["changeFrequency"] }
): UrlEntry[] {
  const toAbsolute = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${p === "/" ? "" : p}`;
  };

  const enLocPath = enPath.startsWith("/") ? enPath : `/${enPath}`;

  const isRoot = enLocPath === "/";
  const priority = opts?.priority ?? (isRoot ? 1 : 0.7);
  const changeFrequency = opts?.changeFrequency ?? "weekly";

  return [{
    url: toAbsolute(enLocPath),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: UrlEntry[] = [];

  // Static pages — cart/compare/favorite excluded (noindexed user-state pages)
  ["/", "/about-us", "/store", "/contact-us"].forEach((p) =>
    entries.push(...withAlternates(p))
  );

  // Dynamic: Categories — canonical path is /store/[slug]
  // /product-category/[slug] intentionally excluded to prevent duplicate content
  try {
    const categories = await getCategories(1000);
    for (const c of categories || []) {
      const slugEn = c?.slug_en || "";
      const slugAr = slugEn;
      if (!slugEn) continue;
      entries.push(
        ...withAlternates(`/store/${slugEn}`, `/store/${slugAr}`, { priority: 0.8 })
      );
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
      const slugAr = slugEn;
      if (!slugEn) continue;
      entries.push(
        ...withAlternates(`/store/${slugEn}`, `/store/${slugAr}`, { priority: 0.7 })
      );
    }
  } catch (e) {
    console.error("[sitemap] brands fetch failed:", e);
  }

  // Dynamic: Products (/product/[slug])
  try {
    const products = await getProducts({ limit: 1000 });
    for (const p of products || []) {
      const slugEn = (p as any)?.slug_en || (p as any)?.slug || "";
      const slugAr = slugEn;
      if (!slugEn) continue;
      entries.push(
        ...withAlternates(`/product/${slugEn}`, `/product/${slugAr}`, { priority: 0.9 })
      );
    }
  } catch (e) {
    console.error("[sitemap] products fetch failed:", e);
  }

  return entries as MetadataRoute.Sitemap;
}
