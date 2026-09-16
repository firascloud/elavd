import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
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
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const pathname = request.nextUrl.pathname;
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
    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ],
};
