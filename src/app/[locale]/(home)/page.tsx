import Hero from "./_components/hero";
import OurCategories from "./_components/ourCategories";
import OurProducts from "./_components/ourProducts";
import SpecialOffers from "./_components/specialOffers";
import Script from "next/script";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getHomeJsonLd } from "@/seo/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let title = "Dubai Network IT EST | Technology Solutions";
  let description = "Leading IT establishment offering technology solutions, services and products.";
  try {
    const t = await getTranslations({ locale, namespace: "common" });
    // Use optional lookups if available, fallback otherwise
    title = (t as any)?.optional?.("HomeTitle") ?? title;
    description = (t as any)?.optional?.("HomeDescription") ?? description;
  } catch {
    // Fallback to defaults when messages are missing
  }
  const baseUrl = "https://elavd.com";
  const url = `${baseUrl}/${locale}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Dubai Network IT EST",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home() {
  return (
    <main className="min-h-screen px-6 lg:px-0">
      {/* locale-aware JSON-LD is handled in layout via lang attribute; keep page JSON-LD simple */}
      <Script id="jsonld-home" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(getHomeJsonLd("en"))}
      </Script>
      <Hero />
      <OurCategories />
      <SpecialOffers position={1} />
      <OurProducts />
      <SpecialOffers position={2} />
    </main>
  );
}
