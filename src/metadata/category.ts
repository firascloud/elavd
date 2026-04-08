import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";

type CategorySeo = {
    slug_en?: string;
    slug_ar?: string;
    slug?: string;
    name_en?: string | null;
    name_ar?: string | null;
    description_en?: string | null;
    description_ar?: string | null;
    image_url?: string | null;
    seo_title_en?: string | null;
    seo_title_ar?: string | null;
    seo_description_en?: string | null;
    seo_description_ar?: string | null;
    seo_keywords_en?: unknown;
    seo_keywords_ar?: unknown;
};

export function categoryMetadata(opts: {
    locale: string;
    slug: string; // route slug
    category?: CategorySeo | null;
}): Metadata {
    const isAr = opts.locale === "ar";
    const c = opts.category;

    const title =
        (isAr ? c?.seo_title_ar : c?.seo_title_en) ||
        (isAr ? c?.name_ar : c?.name_en) ||
        "Category";

    const description =
        (isAr ? c?.seo_description_ar : c?.seo_description_en) ||
        (isAr ? c?.description_ar : c?.description_en) ||
        "";

    const keywords = normalizeKeywords(isAr ? c?.seo_keywords_ar : c?.seo_keywords_en);
    const image = c?.image_url || undefined;

    return buildMetadata({
        locale: opts.locale,
        path: `/product-category/${opts.slug}`,
        title,
        description,
        keywords,
        images: image ? [{ url: image, alt: title }] : undefined,
        type: "website",
    });
}

