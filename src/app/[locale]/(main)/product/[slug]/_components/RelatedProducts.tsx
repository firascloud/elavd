import React from "react";
import { getTranslations } from "next-intl/server";
import type { Product } from "@/services/home";
import { ProductCard } from "@/components/common/product-card";

interface RelatedProductsProps {
  products: Product[];
}

export default async function RelatedProducts({ products }: RelatedProductsProps) {
  const t = await getTranslations("common");

  if (!products.length) return null;

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-[#1a1a1a] font-cairo">
          {t("RelatedProducts")}
        </h3>
        <div className="h-[2px] flex-1 bg-gray-100 mx-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} is_hot={p.is_featured} />
        ))}
      </div>
    </section>
  );
}

