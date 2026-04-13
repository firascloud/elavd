import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function favoriteMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const isAr = locale === "ar";

  return buildMetadata({
    locale,
    path: "/favorite",
    title: isAr
      ? "قائمة المفضلة | مؤسسة إيلافد"
      : "Wishlist | Elavd",
    description: isAr
      ? "احفظ منتجاتك المفضلة لدى مؤسسة إيلافد لمراجعتها لاحقاً، بما يشمل أجهزة البصمة والحضور والانصراف، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات."
      : "Save your favorite products at Elavd for later review, including attendance devices, safes, money counting machines, and card printers.",
    keywords: isAr
      ? [
          "قائمة المفضلة",
          "المفضلة",
          "قائمة الرغبات",
          "منتجات مفضلة",
          "متجر إيلافد",
          "أجهزة البصمة",
          "الخزن الحديدية",
          "مكائن عد النقود",
          "طابعات الكروت",
        ]
      : [
          "wishlist",
          "favorites",
          "saved products",
          "Elavd store",
          "attendance devices",
          "safes",
          "money counting machines",
          "card printers",
        ],
    noindex: true,
  });
}