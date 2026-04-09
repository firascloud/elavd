import type { Metadata } from "next";

export const BASE_URL = "https://elavd.com";
export const SITE_NAME = "Dubai Network IT EST";
export const DEFAULT_LOCALES = ["en", "ar"] as const;

export type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function toAbsoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return pathOrUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function cleanPath(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p === "/" ? "" : p;
}

export function buildLanguageAlternates(path: string) {
  const p = cleanPath(path);
  const languages: Record<string, string> = {};
  // hreflang spec requires absolute URLs
  for (const l of DEFAULT_LOCALES) languages[l] = `${BASE_URL}/${l}${p}`;
  // x-default signals preferred fallback language to Google
  languages["x-default"] = `${BASE_URL}/en${p}`;
  return languages;
}

export function buildOpenGraphImages(images?: SeoImage[]) {
  if (!images?.length) return undefined;
  return images.map((img) => ({
    url: toAbsoluteUrl(img.url),
    width: img.width,
    height: img.height,
    alt: img.alt,
  }));
}

export function buildMetadata(opts: {
  locale: string;
  path: string; // "/cart" | "/product/x" etc (no locale prefix)
  title: string;
  description: string;
  keywords?: string[];
  images?: SeoImage[];
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const p = cleanPath(opts.path);
  const url = `${BASE_URL}/${opts.locale}${p}`;
  // Canonical must be absolute to avoid ambiguity
  const canonical = `${BASE_URL}/${opts.locale}${p}`;
  const languages = buildLanguageAlternates(opts.path);
  const ogImages = buildOpenGraphImages(
    opts.images?.length
      ? opts.images
      : [{ url: "/placeholder-logo.svg", width: 1200, height: 630, alt: SITE_NAME }]
  );

  return {
    metadataBase: new URL(BASE_URL),
    title: opts.title,
    description: opts.description,

    alternates: {
      canonical,
      languages,
    },

    robots: opts.noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },

    applicationName: SITE_NAME,
    referrer: "origin-when-cross-origin",
    creator: SITE_NAME,
    publisher: SITE_NAME,
    keywords: opts.keywords,

    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: opts.locale,
      type: opts.type ?? "website",
      images: ogImages,
    },

    twitter: {
      card: ogImages?.length ? "summary_large_image" : "summary",
      title: opts.title,
      description: opts.description,
      images: ogImages?.map((i) => i.url),
    },
  };
}

export function normalizeKeywords(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    // handles JSON-stringified arrays too
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {
      // fallthrough
    }
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

