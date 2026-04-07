"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/services/home";
import { Info, ListChecks } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [tab, setTab] = useState<"desc" | "specs">("desc");

  const desc = useMemo(() => {
    const full = locale === "ar" ? product.full_desc_ar : product.full_desc_en;
    const short = locale === "ar" ? product.short_desc_ar : product.short_desc_en;
    return (full || short || "").trim();
  }, [locale, product.full_desc_ar, product.full_desc_en, product.short_desc_ar, product.short_desc_en]);

  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden w-full">
      <div className="flex items-center gap-0 border-b border-gray-100 px-2 sm:px-6">
        <button
          onClick={() => setTab("desc")}
          className={`h-14 px-4 sm:px-6 cursor-pointer font-black text-xs sm:text-sm font-cairo relative transition-colors ${
            tab === "desc" ? "text-[#1a1a1a]" : "text-gray-400 hover:text-[#1a1a1a]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Info size={16} className={tab === "desc" ? "text-[#f38d38]" : "text-gray-300"} />
            {t("DescriptionTab")}
          </span>
          {tab === "desc" && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f38d38]" />}
        </button>

        <button
          onClick={() => setTab("specs")}
          className={`h-14 px-4 sm:px-6 cursor-pointer font-black text-xs sm:text-sm font-cairo relative transition-colors ${
            tab === "specs" ? "text-[#1a1a1a]" : "text-gray-400 hover:text-[#1a1a1a]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <ListChecks size={16} className={tab === "specs" ? "text-[#f38d38]" : "text-gray-300"} />
            {t("DetailsTab")}
          </span>
          {tab === "specs" && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f38d38]" />}
        </button>
      </div>

      <div className="p-5 sm:p-10">
        {tab === "desc" ? (
          desc ? (
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed sm:leading-8 font-medium whitespace-pre-line">{desc}</div>
          ) : (
            <div className="text-gray-400 text-sm font-bold p-10 text-center">{t("NoDescription")}</div>
          )
        ) : (
          <div className="text-gray-500 text-sm leading-8 font-medium p-10 text-center">
            {t("NoSpecifications")}
          </div>
        )}
      </div>
    </div>
  );
}

