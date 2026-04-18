"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Layers, Phone, Tag, Maximize2, X, Globe } from "lucide-react";
import type { Product } from "@/services/home";
import QuoteModal from "@/components/common/QuoteModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";

interface ProductHeroProps {
  product: Product;
  whatsappUrl: string;
}

export default function ProductHero({ product, whatsappUrl }: ProductHeroProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("common");
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const shortDesc = locale === "ar" ? product.short_desc_ar : product.short_desc_en;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const price =
    typeof product.discount_price === "number"
      ? product.discount_price
      : typeof product.price === "number"
        ? product.price
        : null;

  return (
    <div className="bg-background border border-border rounded-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div
          className="relative bg-muted/30 p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-e lg:border-border overflow-hidden group cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
        >
          {product.main_image ? (
            <>
              <div className="relative w-full aspect-square max-w-[420px] transition-transform duration-200">
                <Image
                  src={product.main_image}
                  alt={name || "Product"}
                  fill
                  className={`object-contain transition-transform duration-300 ${isZooming ? 'scale-[2]' : 'scale-100'}`}
                  style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                  priority
                />
              </div>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="absolute bottom-6 right-6 p-3 rounded-full bg-background shadow-xl border border-border text-muted-foreground hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
              >
                <Maximize2 size={20} />
              </button>
            </>
          ) : (
            <div className="size-32 bg-background rounded-2xl border border-border flex items-center justify-center text-muted-foreground/30 shadow-sm">
              <Layers size={52} />
            </div>
          )}
        </div>

        <div className="px-8 py-6 lg:px-8 lg:py-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-primary text-[10px] font-black ltr:tracking-[0.2em] flex items-center gap-2 uppercase">
                <Tag className="size-3.5" />
                {t("Products")}
              </div>
              {product.brand && (
                <>
                  <span className="text-muted-foreground/30 font-black">•</span>
                  <Link
                    href={`/product/${isAr ? product.brand.slug_ar : product.brand.slug_en}`}
                    className="text-secondary text-[10px] font-black ltr:tracking-[0.2em] flex items-center gap-2 uppercase hover:text-primary transition-colors"
                  >
                    <Globe className="size-3.5" />
                    {isAr ? product.brand.name_ar : product.brand.name_en}
                  </Link>
                </>
              )}
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-foreground">
              {name || "—"}
            </h2>

            {product.country_of_origin && (
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase ltr:tracking-widest bg-muted/50 w-fit px-3 py-1.5 rounded-lg border border-border">
                <Globe className="size-3.5 text-primary" />
                <span>{t("Origin")} {product.country_of_origin}</span>
              </div>
            )}

            {shortDesc && (
              <div 
                className="text-muted-foreground text-sm leading-7 font-medium"
                dangerouslySetInnerHTML={{ __html: shortDesc }}
              />
            )}

            {price !== null && (
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary border border-primary/10 font-black">
                  <span className="text-lg">{price}</span>
                  <span className="text-xs">{t("Currency")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-black text-xs flex items-center justify-center gap-3 shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase ltr:tracking-widest cursor-pointer"
            >
              <Phone size={18} />
              <span>{t("RequestQuote")}</span>
            </button>

            <QuoteModal
              isOpen={isQuoteOpen}
              onClose={() => setIsQuoteOpen(false)}
              product={product}
            />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-5 rounded-xl border border-border bg-background flex items-center justify-center gap-2 text-muted-foreground font-semibold hover:text-primary transition-colors group cursor-pointer"
            >
              <div className="relative size-5 group-hover:scale-110 transition-transform">
                <Image
                  src={require('@/assets/whatsapp.png')}
                  alt="WhatsApp"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-muted-foreground/50 font-black uppercase">
                {t("WhatsApp")}
              </span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase ltr:tracking-[0.15em] text-muted-foreground/50">
            <span>{t("FastShipping")}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{t("TwoYearWarranty")}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{t("TermsConditions")}</span>
          </div>
        </div>
      </div>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none flex items-center justify-center h-screen w-screen pointer-events-none">
          <DialogTitle className="sr-only">
            {isAr ? `معاينة صورة ${name}` : `Preview image for ${name}`}
          </DialogTitle>
          <div className="relative w-full h-[80vh] pointer-events-auto">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <X size={32} />
            </button>
            <Image
              src={product.main_image || ''}
              alt={name || "Product"}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

