import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/common/page-header";
import CategorySidebar from "@/components/common/category-sidebar";
import ProductHero from "./_components/ProductHero";
import ProductTabs from "./_components/ProductTabs";
import RelatedProducts from "./_components/RelatedProducts";
import Script from "next/script";
import { getProductJsonLd } from "@/seo/product";
import {
  getCategories,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/services/home";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const desc = locale === "ar" ? product.short_desc_ar : product.short_desc_en;

  return {
    title: `${name || "Product"} | DUBAI NETWORK IT`,
    description: desc || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const isRtl = locale === "ar";
  const t = await getTranslations("common");

  const phone = "+966556482799";

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, featuredProducts, relatedProducts] = await Promise.all([
    getCategories(10),
    getFeaturedProducts(4),
    getRelatedProducts(product, 4),
  ]);

  const name = isRtl ? product.name_ar : product.name_en;
  const categoryName = product.category
    ? (isRtl ? product.category.name_ar : product.category.name_en)
    : t("Store");
  const categorySlug = product.category?.slug || "";
  const categoryHref = product.category ? `/store/${categorySlug}` : "/store";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20" dir={isRtl ? "rtl" : "ltr"}>
      <Script id="jsonld-product" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(getProductJsonLd(locale, {
          id: product.id,
          slug: (product as any).slug ?? "",
          name_ar: product.name_ar ?? undefined,
          name_en: product.name_en ?? undefined,
          short_desc_ar: product.short_desc_ar ?? undefined,
          short_desc_en: product.short_desc_en ?? undefined,
          main_image: product.main_image ?? undefined,
          sku: (product as any).sku ?? String(product.id)
        }))}
      </Script>
      <PageHeader
        title={name || t("Products")}
        parent={{
          label: categoryName || t("Store"),
          href: categoryHref
        }}
      />
      <div className="container mx-auto xl:px-16 lg:px-10 px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">

          <div className="lg:col-span-9 space-y-8 order-1">
            <ProductHero product={product} phone={phone} />
            <ProductTabs product={product} />

          </div>

          <div className="lg:col-span-3 order-2">
            <CategorySidebar categories={categories} featuredProducts={featuredProducts} activeSlug={""} />
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}