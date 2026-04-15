import Hero from "./_components/hero";
import OurCategories from "./_components/ourCategories";
import OurProducts from "./_components/ourProducts";
import SpecialOffers from "./_components/specialOffers";
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen px-0">
      {/* Inline JSON-LD — rendered in initial HTML so Googlebot sees it immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeJsonLd(locale)) }}
      />
      <Hero />
      <OurCategories />
      <SpecialOffers position={1} />
      <OurProducts />
      <SpecialOffers position={2} />
    </main>
  );
}
