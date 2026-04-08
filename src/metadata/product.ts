import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";

type ProductSeo = {
    id?: string | number;
    slug_en?: string;
    slug_ar?: string;
    slug?: string;
    name_en?: string | null;
    name_ar?: string | null;
    short_desc_en?: string | null;
    short_desc_ar?: string | null;
    main_image?: string | null;
    seo_title_en?: string | null;
    seo_title_ar?: string | null;
    seo_description_en?: string | null;
    seo_description_ar?: string | null;
    seo_keywords_en?: unknown;
    seo_keywords_ar?: unknown;
};

export function productMetadata(opts: {
    locale: string;
    slug: string; // route slug
    product?: ProductSeo | null;
}): Metadata {
    const isAr = opts.locale === "ar";
    const p = opts.product;

    const title =
        (isAr ? p?.seo_title_ar : p?.seo_title_en) ||
        (isAr ? p?.name_ar : p?.name_en) ||
        "Product";

    const description =
        (isAr ? p?.seo_description_ar : p?.seo_description_en) ||
        (isAr ? p?.short_desc_ar : p?.short_desc_en) ||
        "";

    const keywords = normalizeKeywords(isAr ? p?.seo_keywords_ar : p?.seo_keywords_en);
    const image = p?.main_image || undefined;

    return buildMetadata({
        locale: opts.locale,
        path: `/product/${opts.slug}`,
        title,
        description,
        keywords,
        images: image ? [{ url: image, alt: title }] : undefined,
        type: "website",
    });
}

