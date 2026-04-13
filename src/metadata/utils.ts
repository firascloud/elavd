import type { Metadata } from "next";
import {
  generateCanonicalUrl,
  generateHreflangUrls,
  generateXDefaultUrl,
  validateCanonicalUrl,
  validateHreflangUrls,
  getPageSeoData,
} from "@/seo/canonical";

export const BASE_URL = "https://elavd.com";
export const SITE_NAME = "مؤسسة إيلافد";
export const SITE_NAME_EN = "Elavd Office Equipment & Communication Technology Establishment";
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

/**
 * Builds the alternates object (canonical + hreflang languages) using
 * the canonical.ts utilities — includes validation and x-default.
 *
 * @param path  Route path without locale prefix, e.g. "/store" or "/product/my-slug"
 * @param locale  Active locale, e.g. "en" | "ar"
 */
export function buildLanguageAlternates(path: string, locale = "en") {
  const currentPath = path || "/";

  const canonical = generateCanonicalUrl({ baseUrl: BASE_URL, currentPath, locale });
  const hreflangList = generateHreflangUrls({ baseUrl: BASE_URL, currentPath, locale });
  const xDefault = generateXDefaultUrl(BASE_URL, currentPath, locale);

  if (process.env.NODE_ENV !== "production") {
    validateCanonicalUrl(canonical);
    if (hreflangList.length) validateHreflangUrls(hreflangList);
  }

  const languages: Record<string, string> = {};
  for (const { locale: loc, url } of hreflangList) {
    languages[loc] = url;
  }
  if (xDefault) languages["x-default"] = xDefault;

  return { canonical, languages };
}

export function buildOpenGraphImages(images?: SeoImage[]) {
  if (!images?.length) return undefined;

  return images.map((img) => ({
    url: toAbsoluteUrl(img.url),
    width: img.width ?? 1200,
    height: img.height ?? 630,
    alt: img.alt,
  }));
}

interface BuildMetadataOpts {
  locale: string;
  /** Route path WITHOUT locale prefix, e.g. "/store" | "/product/x" | "/" */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  images?: SeoImage[];
  noindex?: boolean;
  type?: "website" | "article";
}

function getLocalizedSiteName(locale: string) {
  return locale === "ar" ? SITE_NAME : SITE_NAME_EN;
}

function buildMetadataBase(
  opts: BuildMetadataOpts,
  canonical: string,
  languages: Record<string, string>
): Metadata {
  const localizedSiteName = getLocalizedSiteName(opts.locale);

  const ogImages = buildOpenGraphImages(
    opts.images?.length
      ? opts.images
      : [
          {
            url: "/placeholder-logo.svg",
            width: 1200,
            height: 630,
            alt: localizedSiteName,
          },
        ]
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
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },

    applicationName: localizedSiteName,
    referrer: "origin-when-cross-origin",
    creator: localizedSiteName,
    publisher: localizedSiteName,
    keywords: opts.keywords,

    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: localizedSiteName,
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

/**
 * Synchronous metadata builder — uses the explicit `path` param.
 * Use this when you know the path at build/request time.
 */
export function buildMetadata(opts: BuildMetadataOpts): Metadata {
  const { canonical, languages } = buildLanguageAlternates(opts.path, opts.locale);
  return buildMetadataBase(opts, canonical, languages);
}

/**
 * Async metadata builder — reads the current path from the
 * middleware-injected `x-pathname` header via getPageSeoData().
 */
export async function buildMetadataSmart(opts: BuildMetadataOpts): Promise<Metadata> {
  const seoData = await getPageSeoData(opts.locale);

  const canonical = seoData.canonicalUrl;
  const languages: Record<string, string> = {};

  for (const { locale: loc, url } of seoData.hreflangUrls) {
    languages[loc] = url;
  }

  if (seoData.xDefaultUrl) {
    languages["x-default"] = seoData.xDefaultUrl;
  }

  return buildMetadataBase(opts, canonical, languages);
}

export function normalizeKeywords(value: unknown): string[] | undefined {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map(String);
      }
    } catch {
      // ignore JSON parse errors and fallback to comma-separated parsing
    }

    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return undefined;
}