"use client";

import React, { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/services/home";
import { FileText } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const desc = useMemo(() => {
    const full = locale === "ar" ? product.full_desc_ar : product.full_desc_en;
    const short = locale === "ar" ? product.short_desc_ar : product.short_desc_en;
    return (full || short || "").trim();
  }, [locale, product.full_desc_ar, product.full_desc_en, product.short_desc_ar, product.short_desc_en]);

  return (
    <section className="w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="relative flex items-center gap-3 border-b border-border bg-gradient-to-l from-primary/[0.05] via-muted/20 to-background px-4 py-3.5 sm:px-6">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
          <FileText className="size-4" />
        </span>
        <h2 className="font-cairo text-sm font-black text-foreground sm:text-base">
          {t("DescriptionTab")}
        </h2>
        <span className="absolute bottom-0 start-4 h-0.5 w-14 rounded-full bg-primary sm:start-6" />
      </div>

      <div className="p-4 sm:p-6">
        {desc ? (
          <div
            className="break-words whitespace-pre-line text-sm font-medium leading-7 text-foreground/75 sm:text-[15px] sm:leading-8
              [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
              [&_blockquote]:my-6 [&_blockquote]:rounded-e-xl [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.05] [&_blockquote]:px-5 [&_blockquote]:py-4
              [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:text-foreground
              [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-black [&_h2]:leading-tight [&_h2]:text-foreground
              [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-extrabold [&_h3]:text-foreground
              [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border
              [&_li]:ps-1 [&_ol]:my-5 [&_ol]:space-y-2 [&_ol]:ps-6 [&_ol]:list-decimal [&_ol]:marker:font-bold [&_ol]:marker:text-primary
              [&_p]:mb-3 [&_p:last-child]:mb-0
              [&_strong]:font-black [&_strong]:text-foreground
              [&_table]:my-7 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-3
              [&_th]:border [&_th]:border-border [&_th]:bg-muted/60 [&_th]:p-3 [&_th]:font-black [&_th]:text-foreground
              [&_ul]:my-5 [&_ul]:space-y-2 [&_ul]:ps-6 [&_ul]:list-disc [&_ul]:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        ) : (
          <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-5 text-center">
            <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
              <FileText className="size-4" />
            </span>
            <p className="text-sm font-bold text-muted-foreground">
              {t("NoDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

