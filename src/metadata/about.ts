import type { Metadata } from "next";
import { buildMetadataSmart } from "./utils";

export async function aboutMetadata(locale: string): Promise<Metadata> {
  const isAr = locale === "ar";

  return buildMetadataSmart({
    locale,
    path: "/about-us",
    title: isAr
      ? "من نحن | مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات في السعودية"
      : "About Us | Elavd Office Equipment & Communication Technology Establishment in Saudi Arabia",
    description: isAr
      ? "تعرّف على مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات، المتخصصة في حلول الأجهزة المكتبية والأنظمة الأمنية في السعودية، بما يشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات البطاقات والباركود."
      : "Learn about Elavd Office Equipment & Communication Technology Establishment, specialized in office equipment and security solutions in Saudi Arabia, including attendance devices, safes, money counting machines, and card and barcode printers.",
    keywords: isAr
      ? [
          "من نحن",
          "مؤسسة إيلافد",
          "إيلافد للأجهزة المكتبية",
          "تقنيات الاتصالات",
          "الأجهزة المكتبية في السعودية",
          "الأنظمة الأمنية في السعودية",
          "أجهزة بصمة",
          "خزنات حديدية",
          "مكائن عد نقود",
          "طابعات البطاقات",
          "طابعات الكروت",
          "طابعات باركود",
          "ملحقات طابعات الكروت",
          "حلول الشركات",
          "مؤسسة أجهزة مكتبية",
          "السعودية",
          "الرياض",
        ]
      : [
          "about us",
          "Elavd",
          "Elavd office equipment",
          "communication technology",
          "office equipment Saudi Arabia",
          "security systems Saudi Arabia",
          "attendance devices",
          "safes",
          "money counting machines",
          "card printers",
          "barcode printers",
          "card printer accessories",
          "business solutions",
          "Saudi Arabia",
          "Riyadh",
        ],
  });
}