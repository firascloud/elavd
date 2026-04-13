import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function compareMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  return buildMetadata({
    locale,
    path: "/compare",
    title: isAr
      ? "مقارنة المنتجات | مؤسسة إيلافد"
      : "Product Comparison | Elavd",
    description: isAr
      ? "قارن بين المنتجات جنباً إلى جنب لاختيار الأنسب لاحتياجاتك من أجهزة البصمة والحضور والانصراف، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات."
      : "Compare products side by side to find the best fit for your needs across attendance devices, safes, money counting machines, and card printers.",
    keywords: isAr
      ? [
          "مقارنة المنتجات",
          "مقارنة",
          "مقارنة أجهزة البصمة",
          "مقارنة الخزن الحديدية",
          "مقارنة مكائن عد النقود",
          "مقارنة طابعات الكروت",
          "اختيار المنتج",
          "متجر إيلافد",
        ]
      : [
          "product comparison",
          "compare products",
          "compare attendance devices",
          "compare safes",
          "compare money counting machines",
          "compare card printers",
          "choose product",
          "Elavd store",
        ],
    noindex: true,
  });
}