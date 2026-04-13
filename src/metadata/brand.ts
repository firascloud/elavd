import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";

type BrandSeo = {
  id?: string | number;
  slug_en?: string | null;
  slug_ar?: string | null;
  name_en?: string | null;
  name_ar?: string | null;
  image_url?: string | null;
  seo_title_en?: string | null;
  seo_title_ar?: string | null;
  seo_description_en?: string | null;
  seo_description_ar?: string | null;
  seo_keywords_en?: unknown;
  seo_keywords_ar?: unknown;
};

export function brandMetadata(opts: {
  locale: string;
  slug: string;
  brand?: BrandSeo | null;
}): Metadata {
  const isAr = opts.locale === "ar";
  const b = opts.brand;

  const brandName =
    (isAr ? b?.name_ar : b?.name_en) ||
    (isAr ? b?.name_en : b?.name_ar) ||
    "Brand";

  const title =
    (isAr ? b?.seo_title_ar : b?.seo_title_en) ||
    (isAr
      ? `${brandName} | منتجات ${brandName} في السعودية | مؤسسة إيلافد`
      : `${brandName} | ${brandName} Products in Saudi Arabia | Elavd`);

  const description =
    (isAr ? b?.seo_description_ar : b?.seo_description_en) ||
    (isAr
      ? `استكشف منتجات ${brandName} لدى مؤسسة إيلافد في السعودية، مع حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية تشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والباركود.`
      : `Explore ${brandName} products at Elavd in Saudi Arabia, with specialized office equipment and security solutions including attendance devices, safes, money counting machines, and card and barcode printers.`);

  const keywords =
    normalizeKeywords(isAr ? b?.seo_keywords_ar : b?.seo_keywords_en) ||
    (isAr
      ? [
          `${brandName}`,
          `منتجات ${brandName}`,
          `${brandName} السعودية`,
          "أجهزة البصمة",
          "الخزن الحديدية",
          "مكائن عد النقود",
          "طابعات الكروت",
          "طابعات البطاقات",
          "طابعات باركود",
          "الأجهزة المكتبية في السعودية",
        ]
      : [
          `${brandName}`,
          `${brandName} products`,
          `${brandName} Saudi Arabia`,
          "attendance devices",
          "safes",
          "money counting machines",
          "card printers",
          "barcode printers",
          "office equipment Saudi Arabia",
        ]);

  const image = b?.image_url || undefined;

  return buildMetadata({
    locale: opts.locale,
    path: `/store/${opts.slug}`,
    title,
    description,
    keywords,
    images: image ? [{ url: image, alt: title }] : undefined,
    type: "website",
  });
}

export function brandsIndexMetadata(locale: string): Metadata {
  const isAr = locale === "ar";

  return buildMetadata({
    locale,
    path: "/brands",
    title: isAr
      ? "العلامات التجارية | مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
      : "Brands | Elavd Office Equipment & Communication Technology",
    description: isAr
      ? "استكشف العلامات التجارية المتوفرة لدى مؤسسة إيلافد في السعودية، ضمن مجموعة متخصصة من أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات والباركود."
      : "Explore the brands available at Elavd in Saudi Arabia across a specialized range of attendance devices, safes, money counting machines, and card and barcode printers.",
    keywords: isAr
      ? [
          "العلامات التجارية",
          "براندات",
          "ماركات الأجهزة المكتبية",
          "أجهزة البصمة",
          "الخزن الحديدية",
          "مكائن عد النقود",
          "طابعات الكروت",
          "طابعات البطاقات",
          "طابعات باركود",
          "السعودية",
        ]
      : [
          "brands",
          "office equipment brands",
          "attendance device brands",
          "safe brands",
          "money counting machine brands",
          "card printer brands",
          "barcode printer brands",
          "Saudi Arabia",
        ],
    type: "website",
  });
}