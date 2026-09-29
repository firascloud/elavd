import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const legacyRedirects: Record<string, string> = {
  "/مكائن-عد-نقود/mka-en-ed-alnqwd-kisan-k2.html": "/product/kisan-k2-money-counting-machine",
  "/mka-en-ed-alnqwd-kisan-k2.html": "/product/kisan-k2-money-counting-machine",
  "/counting-machine-kisan-k2.html": "/product/kisan-k2-money-counting-machine",
  "/cassida-xpecto-جهاز-عد-النقود": "/product/cassida-xpecto-money-counting-machine",
  "/ماكينة-عد-النقود-هيتاشي": "/product/hitachi-hi110-money-counting-machine",
  "/NV-الة-عد-النقود": "/product/nv-money-counting-machine",
  "/mixed-notes-money-counting-machines": "/store/money-counting-machines",
  "/money-counting-machines": "/store/money-counting-machines",
  "/مكائن-عد-نقود": "/store/money-counting-machines",
  "/مكائن-عد-النقود-لفئات-نقدية-مختلطة": "/store/money-counting-machines",
  "/مكائن-عد-النقود-لفئة-نقدية-واحدة": "/store/money-counting-machines",
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let decodedPathname = pathname;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    // Malformed legacy document URLs still receive a 404 below.
  }
  const legacyPath = decodedPathname.replace(/\/+$/, "");
  const isLegacyDocument = /\.(?:html|php)(?:\/|$)/i.test(pathname);
  const legacyDestination = (Object.hasOwn(legacyRedirects, legacyPath) ? legacyRedirects[legacyPath] : null) ||
    (isLegacyDocument && legacyPath === "/about-us.html" ? "/about-us" : null) ||
    (isLegacyDocument && legacyPath === "/index.php" && !request.nextUrl.search ? "/" : null);

  // A legacy product_id may refer to a different product; let normal routing decide.
  const skipLegacyRedirect = Boolean(legacyDestination && request.nextUrl.searchParams.has("product_id"));

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim()
    .toLowerCase();
  const requestHost = (forwardedHost || request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();

  // Keep one permanent public host. This also protects canonical consistency
  // when a platform-level domain redirect is changed or bypassed.
  if (requestHost === "www.elavd.com") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = "elavd.com";
    canonicalUrl.port = "";
    if (legacyDestination && !skipLegacyRedirect) {
      canonicalUrl.pathname = legacyDestination;
      canonicalUrl.search = "";
    }
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // Keep these metadata routes out of locale routing on the canonical host.
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // Resolve known legacy paths before locale routing; unknown documents stay 404.
  if (legacyDestination && !skipLegacyRedirect) {
    return NextResponse.redirect(new URL(legacyDestination, request.url), 308);
  }
  if (isLegacyDocument && !skipLegacyRedirect) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const token = request.cookies.get("access_token")?.value;
  const hasLocalePreference = request.cookies.has("NEXT_LOCALE");

  // Always start first-time visitors in Arabic instead of inferring English
  // from the browser's Accept-Language header. The language switcher can
  // still persist an explicit English preference afterwards.
  if (!hasLocalePreference) {
    request.cookies.set("NEXT_LOCALE", routing.defaultLocale);
  }
 
  if (pathname.includes("/admin")) {
    if (!token) { 
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Make the public pathname available to metadata builders on the rewritten
  // locale route so every page emits a correct self-referencing canonical.
  request.headers.set("x-pathname", pathname);

  const response = await intlMiddleware(request);
  
  // Also set it on the response for client-side visibility if needed
  if (response) {
    response.headers.set("x-pathname", pathname);

    if (!hasLocalePreference) {
      response.cookies.set("NEXT_LOCALE", routing.defaultLocale, {
        path: "/",
        sameSite: "lax",
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Legacy documents, including malformed paths nested below .html/.php.
    // Do not run locale middleware for static assets or protected routes.
    "/((?!api/|_next/|_vercel/|admin/).*\\.(?:html|php)(?:/[^.]*)?)",
    // Include only public SEO files in the www-to-non-www redirect.
    "/robots.txt",
    "/sitemap.xml",
    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ],
};
