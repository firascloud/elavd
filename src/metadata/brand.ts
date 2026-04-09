import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";

type BrandSeo = {
    id?: string | number;
    slug_en?: string | null;
    slug_ar?: string | null;
    name_en?: string | null;
    name_ar?: string | null;
    image_url?: string | null;
    seo_title_en?: string | null;
    seo_title_ar?: string | null;
    seo_description_en?: string | null;
    seo_description_ar?: string | null;
    seo_keywords_en?: unknown;
    seo_keywords_ar?: unknown;
};

export function brandMetadata(opts: {
    locale: string;
    slug: string; // route slug
    brand?: BrandSeo | null;
}): Metadata {
    const isAr = opts.locale === "ar";
    const b = opts.brand;

    const title =
        (isAr ? b?.seo_title_ar : b?.seo_title_en) ||
        (isAr ? b?.name_ar : b?.name_en) ||
        "Brand";

    const description =
        (isAr ? b?.seo_description_ar : b?.seo_description_en) ||
        (isAr ? (isAr ? `منتجات من ${b?.name_ar}` : `Products from ${b?.name_en}`) : "") ||
        "";

    const keywords = normalizeKeywords(isAr ? b?.seo_keywords_ar : b?.seo_keywords_en);
    const image = b?.image_url || undefined;

    return buildMetadata({
        locale: opts.locale,
        path: `/store/${opts.slug}`, // Brands now link to store
        title,
        description,
        keywords,
        images: image ? [{ url: image, alt: title }] : undefined,
        type: "website",
    });
}

export function brandsIndexMetadata(locale: string): Metadata {
    const isAr = locale === "ar";
    return buildMetadata({
        locale,
        path: "/brands",
        title: isAr ? "العلامات التجارية" : "Brands",
        description: isAr 
            ? "استكشف مجموعتنا الواسعة من العلامات التجارية والشركات المصنعة المتميزة." 
            : "Explore our wide range of premium brands and manufacturers.",
        type: "website",
    });
}
