"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Layers, Phone, Tag, Maximize2, X, Globe } from "lucide-react";
import type { Product } from "@/services/home";
import QuoteModal from "@/components/common/QuoteModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ProductHeroProps {
  product: Product;
  phone: string;
}

export default function ProductHero({ product, phone }: ProductHeroProps) {
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
    <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div 
          className="relative bg-[#fcfcfc] p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-e lg:border-gray-100 overflow-hidden group cursor-crosshair"
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
                className="absolute bottom-6 right-6 p-3 rounded-full bg-white shadow-xl border border-gray-100 text-gray-500 hover:text-[#f38d38] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
              >
                <Maximize2 size={20} />
              </button>
            </>
          ) : (
            <div className="size-32 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-200 shadow-sm">
              <Layers size={52} />
            </div>
          )}
        </div>

        <div className="px-8 py-6 lg:px-8 lg:py-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-[#f38d38] text-[10px] font-black tracking-[0.2em] flex items-center gap-2 uppercase">
              <Tag className="size-3.5" />
              {t("Products")}
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-[#1a1a1a]">
              {name || "—"}
            </h2>

            {product.country_of_origin && (
              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                <Globe className="size-3.5 text-[#f38d38]" />
                <span>{t("Origin")} {product.country_of_origin}</span>
              </div>
            )}

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
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="h-12 px-6 rounded-md bg-[#f38d38] text-white font-black text-xs flex items-center justify-center gap-3 shadow-md shadow-orange-100 hover:bg-[#e67e22] transition-all active:scale-95 uppercase tracking-widest cursor-pointer"
            >
              <Phone size={18} />
              <span>{t("RequestQuote")}</span>
            </button>
 
            <QuoteModal 
              isOpen={isQuoteOpen} 
              onClose={() => setIsQuoteOpen(false)} 
              product={product} 
            />

            <div className="h-12 px-5 rounded-xl border border-gray-100 bg-white flex items-center justify-center gap-1 text-gray-600 font-semibold">
              <span className="text-xs text-gray-400 font-black uppercase">
                {t("CallUs")} :
              </span>
              <a href={`tel:${phone}`} className="hover:text-[#f38d38] text-[15px] transition-colors">
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

