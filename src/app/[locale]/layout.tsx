import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { BASE_URL, SITE_NAME } from "@/metadata/utils";
import { getStorefrontCategories } from "@/services/storefrontServer";
import DeferredToaster from "@/components/DeferredToaster";

export async function generateStaticParams() {
  const locales = ["en", "ar"];
  return locales.map((locale) => ({ locale }));
}

import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import DeferredAnalytics from "@/components/analytics/DeferredAnalytics";

const arabicStoreFont = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  preload: false,
  variable: "--font-tajawal",
  fallback: ["Segoe UI", "Tahoma", "Arial"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = (await import(`../../../messages/common/${locale}.json`)).default;
  const headerCategories = await getStorefrontCategories(10);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={locale === "ar" ? `${arabicStoreFont.variable} font-arabic-store` : "font-inter"}
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <head>
          <meta name="next-head-count" content="0" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#d94a4b" />
          <meta name="google-site-verification" content="ERXn8H6hiTOE4gPlX7GEJFf_G5CgxqOkIaGGhSKreFE" />
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

        <body className="antialiased">
          <DeferredAnalytics />
          <a


            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none transition-all"
          >
            {locale === "en" ? "Skip to main content" : "الانتقال إلى المحتوى الرئيسي"}
          </a>
          <DeferredToaster />
          <MainLayoutWrapper categories={headerCategories}>
            {children}
          </MainLayoutWrapper>
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
