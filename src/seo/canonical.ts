/**
 * Canonical & Hreflang URL utilities — elavd.com
 *
 * Adapted from a reference implementation for a bilingual (ar/en) Next.js 15 site
 * using next-intl with localePrefix: 'never'.
 *
 * Even though the user-facing URL has no locale prefix (e.g. elavd.com/store),
 * the hreflang and canonical tags reference the internal locale-prefixed paths
 * (e.g. elavd.com/en/store | elavd.com/ar/store). This is the recommended
 * approach when localePrefix:'never' is used — Google accepts it.
 */

import { headers } from "next/headers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HreflangUrl {
  locale: string;
  url: string;
}

export interface CanonicalConfig {
  baseUrl: string;
  /** Pathname as received from middleware (no locale prefix, e.g. "/store") */
  currentPath: string;
  locale: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://elavd.com";
const LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "ar"; // matches routing.ts

/**
 * Pages that are safe to generate hreflang for.
 * Add new static routes here as they are created.
 */
const SAFE_PATHS = [
  "/",
  "/store",
  "/about-us",
  "/contact-us",
];

/**
 * Canonical URLs for these paths will be rejected.
 * Matches robots.ts disallow list.
 */
const BLOCKED_PATHS = [
  "/admin",
  "/api",
  "/_next",
  "/login",
  "/cart",
  "/compare",
  "/favorite",
];

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Strips the locale segment from a path if present.
 * "/en/store" → "/store"   |   "/store" → "/store"
 */
export function extractCanonicalPath(
  currentPath: string,
  locale: string
): string {
  let path = currentPath || "/";

  // Strip leading locale segment if present (e.g. when path comes with prefix)
  for (const loc of LOCALES) {
    if (path === `/${loc}`) { path = "/"; break; }
    if (path.startsWith(`/${loc}/`)) { path = path.slice(`/${loc}`.length); break; }
  }

  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Returns true if the path should have canonical / hreflang tags.
 * Dynamic product and store/category pages are allowed by pattern.
 */
function isSafePath(path: string): boolean {
  const p = path === "" ? "/" : path;

  // Static safe paths
  if (SAFE_PATHS.includes(p)) return true;

  // Dynamic store/category pages: /store/some-slug
  if (p.startsWith("/store/") && p.split("/").length >= 3) return true;

  // Dynamic product pages: /product/some-slug
  if (p.startsWith("/product/") && p.split("/").length >= 3) return true;

  return false;
}

function isBlockedPath(path: string): boolean {
  return BLOCKED_PATHS.some((blocked) => path === blocked || path.startsWith(`${blocked}/`));
}

// ─── Canonical URL ────────────────────────────────────────────────────────────

/**
 * Builds the canonical URL for the current page.
 * For localePrefix:'never', canonical points to the locale-prefixed inter  nal URL.
 * Example: /store → https://elavd.com/en/store   (for locale = "en")
 */
export function generateCanonicalUrl({
  baseUrl,
  currentPath,
  locale,
}: CanonicalConfig): string {
  const canonicalPath = extractCanonicalPath(currentPath, locale);

  // Clean up any accidental double slashes
  const cleanPath = canonicalPath.replace(/\/+/g, "/");

  // Build locale-prefixed canonical (required by hreflang spec)
  const canonicalUrl = cleanPath === "/"
    ? `${baseUrl}/${locale}`
    : `${baseUrl}/${locale}${cleanPath}`;

  try {
    new URL(canonicalUrl); // validates format
    return canonicalUrl;
  } catch (error) {
    console.error("[SEO] Invalid canonical URL generated:", canonicalUrl, error);
    return `${baseUrl}/${DEFAULT_LOCALE}`;
  }
}

// ─── Hreflang ────────────────────────────────────────────────────────────────

/**
 * Generates hreflang <link> entries for all supported locales.
 * Returns an empty array for blocked or unsafe paths (noindexed pages).
 */
export function generateHreflangUrls({
  baseUrl,
  currentPath,
  locale,
}: CanonicalConfig): HreflangUrl[] {
  const canonicalPath = extractCanonicalPath(currentPath, locale);

  if (!isSafePath(canonicalPath) || isBlockedPath(canonicalPath)) {
    return [];
  }

  return LOCALES.map((loc) => ({
    locale: loc,
    url: canonicalPath === "/"
      ? `${baseUrl}/${loc}`
      : `${baseUrl}/${loc}${canonicalPath}`,
  }));
}

/**
 * Generates the x-default hreflang URL.
 * x-default always points to the English version (as the international fallback).
 */
export function generateXDefaultUrl(
  baseUrl: string,
  currentPath: string,
  locale: string
): string {
  const canonicalPath = extractCanonicalPath(currentPath, locale);

  if (!isSafePath(canonicalPath) || isBlockedPath(canonicalPath)) {
    return `${baseUrl}/en`;
  }

  return canonicalPath === "/" ? `${baseUrl}/en` : `${baseUrl}/en${canonicalPath}`;
}

// ─── Validators ───────────────────────────────────────────────────────────────

export function validateHreflangUrls(hreflangUrls: HreflangUrl[]): boolean {
  const locales = hreflangUrls.map((u) => u.locale);
  if (locales.length !== new Set(locales).size) {
    console.error("[SEO] Duplicate locales in hreflang URLs");
    return false;
  }
  for (const { url } of hreflangUrls) {
    try {
      new URL(url);
    } catch {
      console.error("[SEO] Invalid hreflang URL:", url);
      return false;
    }
  }
  return true;
}

export function validateCanonicalUrl(canonicalUrl: string): boolean {
  try {
    const url = new URL(canonicalUrl);

    if (!url.protocol.startsWith("http")) {
      console.error("[SEO] Canonical must use HTTP/HTTPS:", canonicalUrl);
      return false;
    }

    // Reject if a domain name bled into the path (misconfiguration)
    if (/\/www\.|\/[a-z0-9-]+\.(com|net|org|io|co|ae)/i.test(url.pathname)) {
      console.error("[SEO] Domain name leaked into canonical path:", url.pathname);
      return false;
    }

    // Reject blocked paths
    for (const blocked of BLOCKED_PATHS) {
      if (url.pathname === blocked || url.pathname.startsWith(`${blocked}/`)) {
        console.error("[SEO] Canonical points to a blocked path:", canonicalUrl);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("[SEO] Invalid canonical URL format:", canonicalUrl, error);
    return false;
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Reads the current page path from the middleware-injected `x-pathname` header
 * and returns all SEO-relevant URLs for that page.
 *
 * Must be called from a Server Component or Server Action.
 *
 * @example
 * const { canonicalUrl, hreflangUrls, xDefaultUrl } = await getPageSeoData(locale);
 */
export async function getPageSeoData(locale: string) {
  const headersList = await headers();

  // x-pathname is injected by middleware.ts for every request
  const currentPath = headersList.get("x-pathname") || "/";

  const canonicalUrl = generateCanonicalUrl({ baseUrl: BASE_URL, currentPath, locale });
  const hreflangUrls = generateHreflangUrls({ baseUrl: BASE_URL, currentPath, locale });
  const xDefaultUrl = generateXDefaultUrl(BASE_URL, currentPath, locale);

  if (!validateCanonicalUrl(canonicalUrl)) {
    console.error("[SEO] Canonical validation failed:", canonicalUrl, "path:", currentPath);
  }
  if (hreflangUrls.length > 0 && !validateHreflangUrls(hreflangUrls)) {
    console.error("[SEO] Hreflang validation failed:", hreflangUrls);
  }

  return {
    /** Absolute locale-prefixed canonical URL for this page and locale */
    canonicalUrl,
    /** Array of { locale, url } pairs for all supported locales */
    hreflangUrls,
    /** x-default URL (always points to English version) */
    xDefaultUrl,
  };
}
