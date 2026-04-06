import type { Metadata } from "next";
import { El_Messiri, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Providers from "./providers";
import { Toaster } from "sonner";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "@/components/Layout/footer/footer";
import { Header } from "@/components/Layout/header/header";
import FloatingActions from "@/components/FloatingActions";

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

export const metadata: Metadata = {};

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
      >
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
