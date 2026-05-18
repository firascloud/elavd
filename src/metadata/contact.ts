import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart } from "./utils";

export async function contactMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact-us" });
  const isAr = locale === "ar";

  const title =
    (t as any)?.optional?.("title") ??
    (isAr
      ? "تواصل معنا | مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
      : "Contact Us | Elavd Office Equipment & Communication Technology");

  const description =
    (t as any)?.optional?.("subtitle") ??
    (isAr
      ? "تواصل مع مؤسسة إيلافد في السعودية للاستفسار عن مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود، مع خدمة موثوقة ودعم سريع للأفراد والشركات."
      : "Contact Elavd in Saudi Arabia for inquiries about money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers, with reliable service and fast support for individuals and businesses.");

  return buildMetadataSmart({
    locale,
    path: "/contact-us",
    title,
    description,
    keywords: isAr
      ? [
          "تواصل معنا",
          "اتصل بنا",
          "مؤسسة إيلافد",
          "التواصل مع إيلافد",
          "دعم العملاء",
          "استفسارات المنتجات",
          "مكائن عد النقود",
          "الخزن الحديدية",
          "خزنات حديدية",
          "أجهزة البصمة",
          "أجهزة حضور وانصراف",
          "طابعات الكروت",
          "طابعات البطاقات",
          "طابعات باركود",
          "الأجهزة المكتبية في السعودية",
          "الرياض",
          "السعودية",
        ]
      : [
          "contact us",
          "Elavd contact",
          "customer support",
          "product inquiries",
          "money counting machines",
          "safes",
          "attendance devices",
          "time attendance systems",
          "card printers",
          "barcode printers",
          "office equipment Saudi Arabia",
          "Riyadh",
          "Saudi Arabia",
        ],
  });
}