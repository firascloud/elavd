import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function cartMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  return buildMetadata({
    locale,
    path: "/cart",
    title: isAr
      ? "سلة التسوق | مؤسسة إيلافد"
      : "Shopping Cart | Elavd",
    description: isAr
      ? "راجع المنتجات التي أضفتها إلى السلة وأرسل طلبك بسهولة من مؤسسة إيلافد، بما يشمل أجهزة البصمة والحضور والانصراف، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات."
      : "Review the products added to your cart and submit your request easily with Elavd, including attendance devices, safes, money counting machines, and card printers.",
    keywords: isAr
      ? [
          "سلة التسوق",
          "سلة",
          "طلب عرض سعر",
          "متجر إيلافد",
          "أجهزة البصمة",
          "الخزن الحديدية",
          "مكائن عد النقود",
          "طابعات الكروت",
        ]
      : [
          "shopping cart",
          "cart",
          "request quote",
          "Elavd store",
          "attendance devices",
          "safes",
          "money counting machines",
          "card printers",
        ],
    noindex: true,
  });
}