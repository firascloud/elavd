import { headers } from "next/headers";

export interface HreflangUrl {
    locale: string;
    url: string;
}

export interface CanonicalConfig {
    baseUrl: string;
    currentPath: string;
    locale: string;
}

export function extractCanonicalPath(currentPath: string, locale: string): string {
    let pathWithoutLocale = currentPath.replace(`/${locale}`, "") || "/";

    // Optional redirects map; keep simple for this project
    const redirects: Record<string, string> = {
        "/contact": "/contact-us",
    };
    if (redirects[pathWithoutLocale]) {
        pathWithoutLocale = redirects[pathWithoutLocale];
    }
    return pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
}

export function generateCanonicalUrl({ baseUrl, currentPath, locale }: CanonicalConfig): string {
    const canonicalPath = extractCanonicalPath(currentPath, locale);
    let cleanPath = canonicalPath === "" ? "/" : canonicalPath;
    if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
    cleanPath = cleanPath.replace(/\/+/g, "/");
    const canonicalUrl = `${baseUrl}${cleanPath}`;
    try {
        new URL(canonicalUrl);
        return canonicalUrl;
    } catch {
        return `${baseUrl}/`;
    }
}

const SAFE_PATHS = [
    "/",
    "/store",
    "/contact-us",
    "/about-us",
    "/compare",
    "/cart",
    "/favorite",
    "/product:slug",
    "/product-category:slug",
    "/store:slug",
    "/store:slug:subSlug",
];

function isSafePath(path: string): boolean {
    const normalizedPath = path === "" ? "/" : path;
    if (SAFE_PATHS.includes(normalizedPath)) return true;
    if (normalizedPath.startsWith("/product/") && normalizedPath.split("/").length >= 3) return true;
    if (normalizedPath.startsWith("/product-category/") && normalizedPath.split("/").length >= 3) return true;
    if (normalizedPath.startsWith("/store/") && normalizedPath.split("/").length >= 3) return true;
    return false;
}

export function generateHreflangUrls({ baseUrl, currentPath, locale }: CanonicalConfig): HreflangUrl[] {
    const canonicalPath = extractCanonicalPath(currentPath, locale);
    if (!isSafePath(canonicalPath)) return [];
    return [
        { locale: "en", url: `${baseUrl}${canonicalPath}` },
        { locale: "ar", url: `${baseUrl}/ar${canonicalPath}` },
    ];
}

export function generateXDefaultUrl(baseUrl: string, currentPath: string, locale: string): string {
    const canonicalPath = extractCanonicalPath(currentPath, locale);
    return `${baseUrl}${canonicalPath}`;
}

export async function getPageSeoHreflang(locale: string) {
    const headersList = await headers();
    const currentPath = headersList.get("x-invoke-path") || "";
    const baseUrl = "https://elavd.com";
    const canonicalUrl = generateCanonicalUrl({ baseUrl, currentPath, locale });
    const hreflangUrls = generateHreflangUrls({ baseUrl, currentPath, locale });
    const xDefaultUrl = generateXDefaultUrl(baseUrl, currentPath, locale);
    return { canonicalUrl, hreflangUrls, xDefaultUrl };
}

