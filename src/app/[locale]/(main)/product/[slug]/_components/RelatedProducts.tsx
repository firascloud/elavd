"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/services/home";
import { ProductCard } from "@/components/common/product-card";
import useEmblaCarousel from "embla-carousel-react";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
    direction: locale === "ar" ? "rtl" : "ltr",
  });

  if (!products.length) return null;

  return (
    <section className="mt-14 w-full px-0">
      <div className="flex items-center justify-between mb-8 px-2 md:px-0">
        <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a] font-cairo">
          {t("RelatedProducts")}
        </h3>
        <div className="h-[2px] flex-1 bg-gray-100 mx-6 hidden sm:block" />
      </div>

      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 ltr:pl-4 rtl:pr-4 sm:p-0">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="flex-[0_0_85%] sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(33.333%-10.7px)] lg:flex-[0_0_calc(25%-12px)] flex-shrink-0"
            >
              <ProductCard {...p} is_hot={p.is_featured} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

