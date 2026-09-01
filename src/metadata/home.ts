import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart, SITE_NAME } from "./utils";
import { SITE_OG_IMAGE_PATH } from "@/config/site";

export async function homeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  const title = t("HomeTitle");

  const description = t("HomeDescription");

  return buildMetadataSmart({
    locale,
    path: "/",
    title,
    description,
    keywords: isAr
      ? [
          "مؤسسة إيلافد",
          "إيلافد",
          "مكائن عد النقود",
          "ماكينة عد نقود",
          "جهاز عد فلوس",
          "مكائن عد النقود في السعودية",
          "الخزن الحديدية",
          "خزنات حديدية",
          "خزنة حديد",
          "خزنة إلكترونية",
          "خزنات في السعودية",
          "أجهزة البصمة",
          "جهاز بصمة",
          "أجهزة حضور وانصراف",
          "نظام حضور وانصراف",
          "جهاز بصمة حضور وانصراف",
          "طابعات الكروت",
          "طابعة كروت",
          "طابعة بطاقات",
          "طابعات البطاقات",
          "طابعات باركود",
          "طابعة باركود",
          "ملحقات طابعات الكروت",
          "الأجهزة المكتبية في السعودية",
          "الأنظمة الأمنية في السعودية",
          "السعودية",
          "الرياض",
          "جدة",
          "الدمام",
        ]
      : [
          "Elavd",
          "money counting machines",
          "cash counting machine",
          "money counter Saudi Arabia",
          "safes",
          "safe box",
          "electronic safes",
          "safes Saudi Arabia",
          "attendance devices",
          "fingerprint device",
          "time attendance system",
          "attendance and departure devices",
          "card printers",
          "card printer",
          "ID card printer",
          "barcode printers",
          "barcode printer",
          "card printer accessories",
          "office equipment Saudi Arabia",
          "security solutions Saudi Arabia",
          "Saudi Arabia",
          "Riyadh",
          "Jeddah",
          "Dammam",
        ],
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  });
}

export async function simplePageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noindex?: boolean;
}): Promise<Metadata> {
  return buildMetadataSmart({
    locale: opts.locale,
    path: opts.path,
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    images: opts.images,
    noindex: opts.noindex,
  });
}
