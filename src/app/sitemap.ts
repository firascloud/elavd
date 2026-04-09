import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/home";

const BASE_URL = "https://elavd.com";
const LOCALES = ["en", "ar"] as const;

type UrlEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
};

/**
 * Emits one <url> entry per locale so both /en/... and /ar/... appear as
 * independent sitemap entries — required by the hreflang spec.
 * arPath is optional: supply it when the Arabic slug differs from English.
 * x-default always points to the English version.
 */
function withAlternates(
  enPath: string,
  arPath?: string,
  opts?: { priority?: number; changeFrequency?: UrlEntry["changeFrequency"] }
): UrlEntry[] {
  const toAbsolute = (locale: string, path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}/${locale}${p === "/" ? "" : p}`;
  };

  const enLocPath = enPath.startsWith("/") ? enPath : `/${enPath}`;
  const arLocPath = arPath
    ? arPath.startsWith("/") ? arPath : `/${arPath}`
    : enLocPath;

  const languages: Record<string, string> = {
    en: toAbsolute("en", enLocPath),
    ar: toAbsolute("ar", arLocPath),
    "x-default": toAbsolute("en", enLocPath),
  };

  const isRoot = enLocPath === "/";
  const priority = opts?.priority ?? (isRoot ? 1 : 0.7);
  const changeFrequency = opts?.changeFrequency ?? "weekly";

  return LOCALES.map((locale) => ({
    url: locale === "ar" ? toAbsolute("ar", arLocPath) : toAbsolute("en", enLocPath),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
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
      const slugAr = c?.slug_ar || slugEn;
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
      const slugAr = b?.slug_ar || slugEn;
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
      const slugAr = (p as any)?.slug_ar || slugEn;
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
