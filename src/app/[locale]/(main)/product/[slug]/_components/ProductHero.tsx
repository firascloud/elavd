"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Layers, Phone, Tag } from "lucide-react";
import type { Product } from "@/services/home";

interface ProductHeroProps {
  product: Product;
  phone: string;
}

export default function ProductHero({ product, phone }: ProductHeroProps) {
  const locale = useLocale();
  const t = useTranslations("common");

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const shortDesc = locale === "ar" ? product.short_desc_ar : product.short_desc_en;

  const price =
    typeof product.discount_price === "number"
      ? product.discount_price
      : typeof product.price === "number"
        ? product.price
        : null;

  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative bg-[#fcfcfc] p-8 lg:p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-e lg:border-gray-100">
          {product.main_image ? (
            <div className="relative w-full aspect-square max-w-[360px]">
              <Image
                src={product.main_image}
                alt={name || "Product"}
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="size-28 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-200 shadow-sm">
              <Layers size={46} />
            </div>
          )}
        </div>

        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-[#f38d38] text-[10px] font-black tracking-[0.2em] flex items-center gap-2 uppercase">
              <Tag className="size-3.5" />
              {t("Products")}
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-[#1a1a1a] font-cairo tracking-tight">
              {name || "—"}
            </h2>

            {shortDesc && (
              <p className="text-gray-500 text-sm leading-7 font-medium">{shortDesc}</p>
            )}

            {price !== null && (
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-[#f38d38] border border-orange-100 font-black">
                  <span className="text-lg">{price}</span>
                  <span className="text-xs">{t("Currency")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${phone}`}
              className="h-12 px-8 rounded-xl bg-[#f38d38] text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-100 hover:bg-[#e67e22] transition-all active:scale-95 uppercase tracking-widest"
            >
              <Phone size={18} />
              <span>{t("RequestQuote")}</span>
            </a>

            <div className="h-12 px-6 rounded-xl border border-gray-100 bg-white flex items-center justify-center gap-2 text-gray-600 font-bold">
              <span className="text-xs text-gray-400 font-black uppercase tracking-widest">
                {t("CallUs")}:
              </span>
              <a href={`tel:${phone}`} className="hover:text-[#f38d38] transition-colors">
                {phone}
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
            <span>{t("FastShipping")}</span>
            <span className="text-gray-300">•</span>
            <span>{t("TwoYearWarranty")}</span>
            <span className="text-gray-300">•</span>
            <span>{t("TermsConditions")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

