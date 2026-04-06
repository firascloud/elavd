import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Layers } from "lucide-react";

import PageHeader from "@/components/common/page-header";
import CategorySidebar from "@/components/common/category-sidebar";
import ProductHero from "./_components/ProductHero";
import ProductTabs from "./_components/ProductTabs";
import RelatedProducts from "./_components/RelatedProducts";

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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20" dir={isRtl ? "rtl" : "ltr"}>
      <PageHeader title={name || t("Products")} icon={<Layers size={28} />} />

      <div className="max-w-7xl mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-9 space-y-8 order-1">
            <ProductHero product={product} phone={phone} />
            <ProductTabs product={product} />
            <RelatedProducts products={relatedProducts} />
          </div>

          <div className="lg:col-span-3 order-2">
            <CategorySidebar categories={categories} featuredProducts={featuredProducts} activeSlug={""} />
          </div>
        </div>
      </div>
    </div>
  );
}