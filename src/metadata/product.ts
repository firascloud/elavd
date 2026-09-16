import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";
import { htmlToPlainText, truncateText } from "@/lib/text";
import {
  getMoneyCountingProductDescription,
  isMoneyCountingProduct,
  moneyCountingSeo,
} from "@/seo/moneyCounting";

type ProductSeo = {
  id?: string | number;
  slug_en?: string;
  slug_ar?: string;
  slug?: string;
  name_en?: string | null;
  name_ar?: string | null;
  short_desc_en?: string | null;
  short_desc_ar?: string | null;
  main_image?: string | null;
  seo_title_en?: string | null;
  seo_title_ar?: string | null;
  seo_description_en?: string | null;
  seo_description_ar?: string | null;
  seo_keywords_en?: unknown;
  seo_keywords_ar?: unknown;
  category?: {
    slug?: string | null;
    slug_en?: string | null;
    slug_ar?: string | null;
    name_en?: string | null;
    name_ar?: string | null;
  } | null;
};

export function productMetadata(opts: {
  locale: string;
  slug: string;
  product?: ProductSeo | null;
}): Metadata {
  const isAr = opts.locale === "ar";
  const p = opts.product;

  const productName =
    (isAr ? p?.name_ar : p?.name_en) ||
    (isAr ? p?.name_en : p?.name_ar) ||
    "Product";

  const isMoneyCounting = isMoneyCountingProduct(p);
  const moneySeo = moneyCountingSeo[isAr ? "ar" : "en"];
  const customTitle = isAr ? p?.seo_title_ar : p?.seo_title_en;
  const sourceDescription =
    (isAr ? p?.seo_description_ar : p?.seo_description_en) ||
    (isAr ? p?.short_desc_ar : p?.short_desc_en);

  const title =
    customTitle ||
    (isMoneyCounting
      ? isAr
        ? `${productName} | ماكينة عدّ نقود في السعودية`
        : `${productName} | Money Counter Saudi Arabia`
      : isAr
      ? `${productName} | مؤسسة إيلافد للأجهزة المكتبية في السعودية`
      : `${productName} | Elavd Office Equipment in Saudi Arabia`);

  const description = isMoneyCounting
    ? getMoneyCountingProductDescription(opts.locale, productName, sourceDescription)
    : sourceDescription
      ? truncateText(htmlToPlainText(sourceDescription), 165)
      : isAr
      ? `اكتشف ${productName} لدى مؤسسة إيلافد في السعودية، ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية تشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والباركود.`
      : `Discover ${productName} at Elavd in Saudi Arabia within specialized office equipment and security solutions.`;

  const keywords =
    normalizeKeywords(isAr ? p?.seo_keywords_ar : p?.seo_keywords_en) ||
    (isMoneyCounting
      ? [productName, ...moneySeo.keywords]
      : isAr
      ? [
          productName,
          "مؤسسة إيلافد",
          "الأجهزة المكتبية في السعودية",
          "أجهزة البصمة",
          "أجهزة حضور وانصراف",
          "الخزن الحديدية",
          "مكائن عد النقود",
          "طابعات الكروت",
          "طابعات البطاقات",
          "طابعات باركود",
          "السعودية",
        ]
      : [
          productName,
          "Elavd",
          "office equipment Saudi Arabia",
          "attendance devices",
          "time attendance systems",
          "safes",
          "money counting machines",
          "card printers",
          "barcode printers",
          "Saudi Arabia",
        ]);

  const image = p?.main_image || undefined;

  return buildMetadata({
    locale: opts.locale,
    path: `/product/${opts.slug}`,
    title,
    description,
    keywords,
    images: image ? [{ url: image, alt: title }] : undefined,
    type: "website",
  });
}
