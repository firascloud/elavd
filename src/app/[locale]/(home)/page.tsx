import Hero from "./_components/hero";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getHomeJsonLd } from "@/seo/home";
import { homeMetadata } from "@/metadata/home";

// Lazy-load below-the-fold sections to reduce initial JS bundle
const OurCategories = dynamic(() => import("./_components/ourCategories"), {
  loading: () => <div className="w-full py-12 bg-white min-h-[400px]" />,
});
const OurProducts = dynamic(() => import("./_components/ourProducts"), {
  loading: () => <div className="w-full py-12 bg-white min-h-[400px]" />,
});
const SpecialOffers = dynamic(() => import("./_components/specialOffers"), {
  loading: () => <div className="w-full min-h-[200px]" />,
});

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
