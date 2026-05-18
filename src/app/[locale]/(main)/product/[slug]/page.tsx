import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/common/page-header";
import CategorySidebar from "@/components/common/category-sidebar";
import ProductHero from "./_components/ProductHero";
import ProductTabs from "./_components/ProductTabs";
import RelatedProducts from "./_components/RelatedProducts";
import { getProductJsonLd } from "@/seo/product";
import { productMetadata } from "@/metadata/product";
import {
  getCategories,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/services/home";
import { getBrandBySlug } from "@/services/brandService";
import { redirect } from "@/i18n/routing";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const [product, brand] = await Promise.all([
    getProductBySlug(slug),
    getBrandBySlug(slug)
  ]);

  if (product) return productMetadata({ locale, slug, product: product as any });
  if (brand) return { title: locale === 'ar' ? brand.name_ar : brand.name_en };

  return { title: "Product Not Found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const isRtl = locale === "ar";
  const t = await getTranslations("common");

  const [product, brand] = await Promise.all([
    getProductBySlug(slug),
    getBrandBySlug(slug)
  ]);

  if (!product && brand) {
    redirect({ href: `/store/${slug}`, locale });
  }

  if (!product) notFound();

  const name = isRtl ? product.name_ar : product.name_en;
  const whatsappUrl = `https://wa.me/966556482799?text=${encodeURIComponent(
    isRtl 
      ? `طلب استفسار عن منتج: ${name}` 
      : `Product Inquiry: ${name}`
  )}`;
  const categoryName = product.category
    ? (isRtl ? product.category.name_ar : product.category.name_en)
    : t("Store");
  const categorySlug = product.category?.slug || "";
  const categoryHref = product.category ? `/store/${categorySlug}` : "/store";

  const [categories, featuredProducts, relatedProducts] = await Promise.all([
    getCategories(10),
    getFeaturedProducts(4),
    getRelatedProducts(product, 4),
  ]);

  return (
    <article className="min-h-screen bg-muted/30 pb-20" dir={isRtl ? "rtl" : "ltr"}>
      {/* Inline JSON-LD — rendered in initial HTML so Googlebot sees it immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProductJsonLd(locale, {
            id: product.id,
            slug: (product as any).slug ?? "",
            name_ar: product.name_ar ?? undefined,
            name_en: product.name_en ?? undefined,
            short_desc_ar: product.short_desc_ar ?? undefined,
            short_desc_en: product.short_desc_en ?? undefined,
            main_image: product.main_image ?? undefined,
            sku: (product as any).sku ?? String(product.id),
            price: (product as any).price ?? null,
            discount_price: (product as any).discount_price ?? null,
            rating: (product as any).rating ?? null,
            images: Array.isArray((product as any).images) ? (product as any).images : undefined
          }, { categoryName: categoryName ?? undefined }))
        }}
      />
      <PageHeader
        title={name || t("Products")}
        parent={{
          label: categoryName || t("Store"),
          href: categoryHref
        }}
      />
      <div className="container mx-auto xl:px-16 lg:px-10 px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          <div className="lg:col-span-9 space-y-8 order-1 lg:order-2">
            <ProductHero product={product} whatsappUrl={whatsappUrl} />
            <ProductTabs product={product} />

          </div>

          <aside className="lg:col-span-3 order-2 lg:order-1">
            <CategorySidebar categories={categories} featuredProducts={featuredProducts} activeSlug={""} />
          </aside>
        </div>
        <RelatedProducts products={relatedProducts} />
      </div>
    </article>
  );
}