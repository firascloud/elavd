import Hero from "./_components/hero";
import type { Metadata } from "next";
import { getHomeJsonLd } from "@/seo/home";
import { homeMetadata } from "@/metadata/home";
import { getStorefrontCategories, getStorefrontProducts } from "@/services/storefrontServer";

import OurCategories from "./_components/ourCategories";
import OurProducts from "./_components/ourProducts";
import SpecialOffers from "./_components/specialOffers";

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
  const [categories, featuredProducts, allProducts, popularProducts] = await Promise.all([
    getStorefrontCategories(16),
    getStorefrontProducts("featured", 4),
    getStorefrontProducts("all", 4),
    getStorefrontProducts("popular", 4),
  ]);

  return (
    <main className="min-h-screen px-0">
      {/* Inline JSON-LD — rendered in initial HTML so Googlebot sees it immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeJsonLd(locale)) }}
      />
      <Hero locale={locale} />
      <OurCategories locale={locale} categories={categories} featuredProducts={featuredProducts} />
      <SpecialOffers position={1} />
      <OurProducts
        productGroups={{
          all: allProducts,
          featured: featuredProducts,
          best_seller: popularProducts,
        }}
      />
      <SpecialOffers position={2} />
    </main>
  );
}
