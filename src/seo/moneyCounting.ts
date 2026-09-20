import { htmlToPlainText, truncateText } from "@/lib/text";

export const MONEY_COUNTING_SLUG = "money-counting-machines";

type CategoryLike = {
  slug?: string | null;
  slug_en?: string | null;
  slug_ar?: string | null;
  name_en?: string | null;
  name_ar?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  seo_title_en?: string | null;
  seo_title_ar?: string | null;
  seo_description_en?: string | null;
  seo_description_ar?: string | null;
};

type ProductLike = {
  slug?: string | null;
  slug_en?: string | null;
  slug_ar?: string | null;
  name_en?: string | null;
  name_ar?: string | null;
  category?: CategoryLike | null;
};

function searchableValue(value: unknown): string {
  return String(value || "").toLowerCase().replace(/[ّـ]/g, "");
}

export function isMoneyCountingCategory(category?: CategoryLike | null): boolean {
  if (!category) return false;

  const value = searchableValue([
    category.slug,
    category.slug_en,
    category.slug_ar,
    category.name_en,
    category.name_ar,
  ].join(" "));

  return [
    MONEY_COUNTING_SLUG,
    "money counting",
    "cash counting",
    "cash counter",
    "عد النقود",
    "عد النقد",
    "عد وفرز",
  ].some((term) => value.includes(searchableValue(term)));
}

export function isMoneyCountingProduct(product?: ProductLike | null): boolean {
  if (!product) return false;
  if (isMoneyCountingCategory(product.category)) return true;

  const value = searchableValue([
    product.slug,
    product.slug_en,
    product.slug_ar,
    product.name_en,
    product.name_ar,
  ].join(" "));

  return [
    "money-counting",
    "money-counter",
    "cash-counter",
    "money counting",
    "cash counting",
    "note detector",
    "عد النقود",
    "عد النقد",
    "عد وفرز النقود",
    "كشف العملات",
  ].some((term) => value.includes(searchableValue(term)));
}

export const moneyCountingSeo = {
  ar: {
    h1: "مكائن عد النقود وكشف التزوير في السعودية",
    title: "مكائن عد النقود وكشف التزوير في السعودية | إيلافد",
    description:
      "تصفح مكائن عد النقود وفرز العملات وكشف التزوير في السعودية. قارن الموديلات والمزايا واختر الجهاز المناسب للبنوك والشركات والمتاجر مع دعم متخصص من إيلافد.",
    keywords: [
      "مكائن عد النقود",
      "ماكينة عد النقود",
      "جهاز عد النقود",
      "ماكينة عد الفلوس",
      "ماكينة عد وكشف التزوير",
      "ماكينة فرز العملات",
      "مكائن عد النقود في السعودية",
      "جهاز كشف العملات المزورة",
    ],
    intro:
      "اكتشف مجموعة مكائن عدّ النقود المخصصة للأعمال التي تتعامل مع النقد يومياً. قارن بين أجهزة العدّ والفرز وكشف التزوير، واختر الحل المناسب لحجم عملك ونوع العملات والسرعة المطلوبة.",
  },
  en: {
    h1: "Money Counting Machines in Saudi Arabia",
    title: "Money Counting Machines in Saudi Arabia | Elavd",
    description:
      "Compare money counting, cash sorting, and counterfeit detection machines in Saudi Arabia. Find the right model for banks, businesses, and retail stores with expert support from Elavd.",
    keywords: [
      "money counting machines Saudi Arabia",
      "cash counting machine",
      "money counter",
      "currency counting machine",
      "counterfeit detection machine",
      "banknote sorter",
      "cash counter Saudi Arabia",
    ],
    intro:
      "Explore money counting machines designed for businesses that handle cash every day. Compare counting, sorting, and counterfeit-detection options to find the right solution for your workload, currencies, and required speed.",
  },
} as const;

function populatedValue(value: string | null | undefined, fallback: string): string {
  return value?.trim() ? value : fallback;
}

export function resolveMoneyCountingCategorySeo(
  locale: string,
  category?: CategoryLike | null,
) {
  const isAr = locale === "ar";
  const fallback = moneyCountingSeo[isAr ? "ar" : "en"];

  return {
    title: populatedValue(
      isAr ? category?.seo_title_ar : category?.seo_title_en,
      fallback.title,
    ),
    description: populatedValue(
      isAr ? category?.seo_description_ar : category?.seo_description_en,
      fallback.description,
    ),
    intro: populatedValue(
      isAr ? category?.description_ar : category?.description_en,
      fallback.intro,
    ),
    h1: fallback.h1,
  };
}

export function getMoneyCountingProductDescription(
  locale: string,
  productName: string,
  existingDescription?: string | null,
): string {
  const cleanExisting = htmlToPlainText(existingDescription);
  if (cleanExisting.length >= 90) return truncateText(cleanExisting, 165);

  return locale === "ar"
    ? truncateText(
        `${productName} من حلول عدّ النقود الاحترافية في السعودية. تعرّف على المواصفات وقدرات العدّ والفرز وكشف التزوير، واطلب عرض سعر من مؤسسة إيلافد.`,
        165,
      )
    : truncateText(
        `${productName} is a professional cash-handling solution in Saudi Arabia. Review its counting, sorting, and counterfeit-detection capabilities and request a quote from Elavd.`,
        165,
      );
}
