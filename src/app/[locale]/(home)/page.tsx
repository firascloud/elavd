import Hero from "./_components/hero";
import OurCategories from "./_components/ourCategories";
import OurProducts from "./_components/ourProducts";
import SpecialOffers from "./_components/specialOffers";
import Script from "next/script";
import type { Metadata } from "next";
import { getHomeJsonLd } from "@/seo/home";
import { homeMetadata } from "@/metadata/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function Home() {
  return (
    <main className="min-h-screen px-6 lg:px-0">
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
