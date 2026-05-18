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
    <div className="bg-background border border-border rounded-md shadow-sm overflow-hidden w-full">
      <div className="flex items-center gap-0 border-b border-border px-2 sm:px-6">
        <button
          onClick={() => setTab("desc")}
          className={`h-14 px-4 sm:px-6 cursor-pointer font-black text-xs sm:text-sm font-cairo relative transition-colors ${
            tab === "desc" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Info size={16} className={tab === "desc" ? "text-primary" : "text-muted-foreground/30"} />
            {t("DescriptionTab")}
          </span>
          {tab === "desc" && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary" />}
        </button>
      </div>

      <div className="p-5 sm:p-10">
        {tab === "desc" ? (
          desc ? (
            <div 
              className="text-muted-foreground text-sm sm:text-base leading-relaxed sm:leading-8 font-medium"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          ) : (
            <div className="text-muted-foreground text-sm font-bold p-10 text-center">{t("NoDescription")}</div>
          )
        ) : (
          <div className="text-muted-foreground text-sm leading-8 font-medium p-10 text-center">
            {t("NoSpecifications")}
          </div>
        )}
      </div>
    </div>
  );
}

