import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, SITE_NAME } from "./utils";

export async function homeMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "common" });

    const title =
        (t as any)?.optional?.("HomeTitle") ?? `${SITE_NAME} | Technology Solutions`;
    const description =
        (t as any)?.optional?.("HomeDescription") ??
        "Leading IT establishment offering technology solutions, services and products.";

    return buildMetadata({
        locale,
        path: "/",
        title,
        description,
        keywords: ["IT", "Security", "Networking", "Saudi Arabia", "Riyadh"],
        images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    });
}

export async function simplePageMetadata(opts: {
    locale: string;
    path: string;
    title: string;
    description: string;
    keywords?: string[];
    images?: { url: string; width?: number; height?: number; alt?: string }[];
    noindex?: boolean;
}): Promise<Metadata> {
    return buildMetadata({
        locale: opts.locale,
        path: opts.path,
        title: opts.title,
        description: opts.description,
        keywords: opts.keywords,
        images: opts.images,
        noindex: opts.noindex,
    });
}

