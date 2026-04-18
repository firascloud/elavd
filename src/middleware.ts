import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;
 
  if (pathname.includes("/admin")) {
    if (!token) { 
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Inject current pathname so server components can read it via next/headers
  // without needing to receive it as a param — used by getPageSeoData()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = await intlMiddleware(request);
  
  // Also set it on the response for client-side visibility if needed
  if (response) {
    response.headers.set("x-pathname", pathname);
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
