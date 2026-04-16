import type { Metadata } from "next";
import { El_Messiri, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Providers from "./providers";
import { Toaster } from "sonner";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { BASE_URL, SITE_NAME } from "@/metadata/utils";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateStaticParams() {
  const locales = ["en", "ar"];
  return locales.map((locale) => ({ locale }));
}

import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { WebVitals } from "@/components/analytics/WebVitals";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale }).catch(() => ({}));

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${locale === "ar" ? elMessiri.className : inter.className}`}
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <head>
          <meta name="next-head-count" content="0" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#f05a5b" />
          <meta name="google-site-verification" content="ERXn8H6hiTOE4gPlX7GEJFf_G5CgxqOkIaGGhSKreFE" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://connect.facebook.net" />
          <link rel="dns-prefetch" href="https://script.hotjar.com" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": locale === "ar" ? "مؤسسة إيلافد" : "Elavd",
                "url": "https://elavd.com",
                "logo": "https://elavd.com/logo.svg",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+966-55-320-2091",
                  "contactType": "customer service",
                  "areaServed": "SA",
                  "availableLanguage": ["Arabic", "English"]
                },
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Jabr Bin Rashid Al Murabba",
                  "addressLocality": "Riyadh",
                  "postalCode": "12628",
                  "addressCountry": "SA"
                }
              })
            }}
          />
        </head>

        <body className="antialiased font-sans">
          <GoogleAnalytics />
          <WebVitals />
          <a


            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none transition-all"
          >
            {locale === "en" ? "Skip to main content" : "الانتقال إلى المحتوى الرئيسي"}
          </a>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" />
              <SidebarProvider>
                <MainLayoutWrapper>
                  <Analytics />
                  <SpeedInsights />
                  {children}
                </MainLayoutWrapper>
              </SidebarProvider>
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    verification: {
      google: "ERXn8H6hiTOE4gPlX7GEJFf_G5CgxqOkIaGGhSKreFE",
    },
  };
}

