import type { Metadata } from "next";
import { buildMetadata, normalizeKeywords } from "./utils";

type CategorySeo = {
  slug_en?: string;
  slug_ar?: string;
  slug?: string;
  name_en?: string | null;
  name_ar?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  image_url?: string | null;
  seo_title_en?: string | null;
  seo_title_ar?: string | null;
  seo_description_en?: string | null;
  seo_description_ar?: string | null;
  seo_keywords_en?: unknown;
  seo_keywords_ar?: unknown;
};

function getCategoryFallbackKeywords(locale: string, categoryName: string, slug: string): string[] {
  const isAr = locale === "ar";
  const s = slug.toLowerCase();

  if (isAr) {
    if (
      s.includes("fingerprint") ||
      s.includes("attendance") ||
      s.includes("time-attendance") ||
      s.includes("biometric") ||
      s.includes("devices")
    ) {
      return [
        categoryName,
        "أجهزة البصمة",
        "جهاز بصمة",
        "أجهزة حضور وانصراف",
        "نظام حضور وانصراف",
        "جهاز بصمة حضور وانصراف",
        "بصمة موظفين",
        "الأجهزة المكتبية في السعودية",
        "السعودية",
      ];
    }

    if (s.includes("safe") || s.includes("safes") || s.includes("vault")) {
      return [
        categoryName,
        "خزنات حديدية",
        "الخزن الحديدية",
        "خزنة حديد",
        "خزنة إلكترونية",
        "خزنات في السعودية",
        "السعودية",
      ];
    }

    if (
      s.includes("money") ||
      s.includes("cash") ||
      s.includes("counting") ||
      s.includes("counter")
    ) {
      return [
        categoryName,
        "مكائن عد النقود",
        "ماكينة عد نقود",
        "جهاز عد فلوس",
        "ماكينة عد وكشف التزوير",
        "مكائن عد النقود في السعودية",
        "السعودية",
      ];
    }

    if (
      s.includes("card-printer") ||
      s.includes("card-printers") ||
      s.includes("card") ||
      s.includes("id-printer")
    ) {
      return [
        categoryName,
        "طابعات الكروت",
        "طابعة كروت",
        "طابعة بطاقات",
        "طابعات البطاقات",
        "طابعة PVC",
        "طابعات الكروت في السعودية",
        "السعودية",
      ];
    }

    if (s.includes("barcode")) {
      return [
        categoryName,
        "طابعات باركود",
        "طابعة باركود",
        "أجهزة باركود",
        "حلول الباركود في السعودية",
        "السعودية",
      ];
    }

    if (s.includes("ribbon") || s.includes("accessories") || s.includes("supplies")) {
      return [
        categoryName,
        "ملحقات طابعات الكروت",
        "ريبون طابعة كروت",
        "كروت PVC",
        "مستلزمات طباعة البطاقات",
        "ملحقات الطابعات في السعودية",
        "السعودية",
      ];
    }

    return [
      categoryName,
      "مؤسسة إيلافد",
      "الأجهزة المكتبية في السعودية",
      "الأنظمة الأمنية في السعودية",
      "السعودية",
    ];
  }

  if (
    s.includes("fingerprint") ||
    s.includes("attendance") ||
    s.includes("time-attendance") ||
    s.includes("biometric") ||
    s.includes("devices")
  ) {
    return [
      categoryName,
      "attendance devices",
      "fingerprint device",
      "time attendance system",
      "biometric devices",
      "Saudi Arabia",
    ];
  }

  if (s.includes("safe") || s.includes("safes") || s.includes("vault")) {
    return [
      categoryName,
      "safes",
      "safe box",
      "electronic safes",
      "safes Saudi Arabia",
      "Saudi Arabia",
    ];
  }

  if (
    s.includes("money") ||
    s.includes("cash") ||
    s.includes("counting") ||
    s.includes("counter")
  ) {
    return [
      categoryName,
      "money counting machines",
      "cash counting machine",
      "money counter",
      "money counter Saudi Arabia",
      "Saudi Arabia",
    ];
  }

  if (
    s.includes("card-printer") ||
    s.includes("card-printers") ||
    s.includes("card") ||
    s.includes("id-printer")
  ) {
    return [
      categoryName,
      "card printers",
      "ID card printer",
      "PVC card printer",
      "card printers Saudi Arabia",
      "Saudi Arabia",
    ];
  }

  if (s.includes("barcode")) {
    return [
      categoryName,
      "barcode printers",
      "barcode printer",
      "barcode solutions Saudi Arabia",
      "Saudi Arabia",
    ];
  }

  if (s.includes("ribbon") || s.includes("accessories") || s.includes("supplies")) {
    return [
      categoryName,
      "card printer accessories",
      "printer ribbon",
      "PVC cards",
      "card printer supplies",
      "Saudi Arabia",
    ];
  }

  return [
    categoryName,
    "Elavd",
    "office equipment Saudi Arabia",
    "security solutions Saudi Arabia",
    "Saudi Arabia",
  ];
}

export function categoryMetadata(opts: {
  locale: string;
  slug: string;
  category?: CategorySeo | null;
}): Metadata {
  const isAr = opts.locale === "ar";
  const c = opts.category;

  const categoryName =
    (isAr ? c?.name_ar : c?.name_en) ||
    (isAr ? c?.name_en : c?.name_ar) ||
    "Category";

  const title =
    (isAr ? c?.seo_title_ar : c?.seo_title_en) ||
    (isAr
      ? `${categoryName} | مؤسسة إيلافد في السعودية`
      : `${categoryName} | Elavd in Saudi Arabia`);

  const description =
    (isAr ? c?.seo_description_ar : c?.seo_description_en) ||
    (isAr ? c?.description_ar : c?.description_en) ||
    (isAr
      ? `استكشف قسم ${categoryName} لدى مؤسسة إيلافد في السعودية، ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية بجودة عالية وخدمة موثوقة.`
      : `Explore the ${categoryName} category at Elavd in Saudi Arabia, featuring specialized office equipment and security solutions with reliable service and quality.`);

  const keywords =
    normalizeKeywords(isAr ? c?.seo_keywords_ar : c?.seo_keywords_en) ||
    getCategoryFallbackKeywords(opts.locale, categoryName, opts.slug);

  const image = c?.image_url || undefined;

  return buildMetadata({
    locale: opts.locale,
    path: `/product-category/${opts.slug}`,
    title,
    description,
    keywords,
    images: image ? [{ url: image, alt: title }] : undefined,
    type: "website",
  });
}