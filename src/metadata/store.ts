import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart } from "./utils";

export async function storeMetadata(locale: string, query?: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  const title = query
    ? isAr
      ? `${query} | متجر مؤسسة إيلافد`
      : `${query} | Elavd Store`
    : isAr
      ? `متجر مؤسسة إيلافد | مكائن عد النقود والخزن الحديدية وأجهزة البصمة وطابعات الكروت`
      : `Elavd Store | Money Counting Machines, Safes, Attendance Devices & Card Printers`;

  const description = query
    ? isAr
      ? `نتائج البحث عن "${query}" في متجر مؤسسة إيلافد. تصفح مجموعة من مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود في السعودية.`
      : `Search results for "${query}" in the Elavd store. Browse money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers in Saudi Arabia.`
    : isAr
      ? "تصفح متجر مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات واستكشف مجموعة متخصصة من مكائن عد النقود، الخزن الحديدية، الخزنات الإلكترونية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والبطاقات والباركود في السعودية."
      : "Browse Elavd Office Equipment & Communication Technology store and discover a specialized range of money counting machines, safes, electronic safes, attendance devices, time attendance systems, and card and barcode printers in Saudi Arabia.";

  return buildMetadataSmart({
    locale,
    path: "/store",
    title,
    description,
    keywords: isAr
      ? [
          "متجر إيلافد",
          "مؤسسة إيلافد",
          "متجر أجهزة مكتبية",
          "مكائن عد النقود",
          "ماكينة عد نقود",
          "جهاز عد فلوس",
          "الخزن الحديدية",
          "خزنات حديدية",
          "خزنة حديد",
          "خزنة إلكترونية",
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
          "السعودية",
          "الرياض",
          "جدة",
          "الدمام",
        ]
      : [
          "Elavd store",
          "Elavd",
          "office equipment store",
          "money counting machines",
          "cash counting machine",
          "money counter",
          "safes",
          "safe box",
          "electronic safes",
          "attendance devices",
          "fingerprint device",
          "time attendance system",
          "card printers",
          "card printer",
          "ID card printer",
          "barcode printers",
          "barcode printer",
          "card printer accessories",
          "office equipment Saudi Arabia",
          "Saudi Arabia",
          "Riyadh",
          "Jeddah",
          "Dammam",
        ],
  });
}