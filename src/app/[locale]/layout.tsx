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
import Script from "next/script";

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
          <meta name="theme-color" content="#f38d38" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://connect.facebook.net" />
          <link rel="dns-prefetch" href="https://script.hotjar.com" />
          {/* Defer any third-party loaders until afterInteractive if needed */}
          <Script id="defer-third-party" strategy="afterInteractive">
            {`/* place deferred third-party loaders here if required */`}
          </Script>
        </head>
        <body className="antialiased">
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
  };
}
