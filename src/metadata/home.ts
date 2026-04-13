import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart, SITE_NAME } from "./utils";

export async function homeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  const title =
    (t as any)?.optional?.("HomeTitle") ??
    (isAr
      ? "مؤسسة إيلافد | مكائن عد النقود والخزن الحديدية وأجهزة البصمة وطابعات الكروت في السعودية"
      : "Elavd | Money Counting Machines, Safes, Attendance Devices & Card Printers in Saudi Arabia");

  const description =
    (t as any)?.optional?.("HomeDescription") ??
    (isAr
      ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات توفر حلولاً متكاملة في السعودية تشمل مكائن عد النقود، الخزن الحديدية، الخزنات الإلكترونية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والبطاقات والباركود، بجودة عالية وخدمة موثوقة للأفراد والشركات."
      : "Elavd Office Equipment & Communication Technology provides integrated solutions in Saudi Arabia including money counting machines, safes, electronic safes, attendance devices, time attendance systems, and card and barcode printers with reliable service and high-quality products.");

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
        url: "/placeholder-logo.svg",
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