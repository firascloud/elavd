import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function cartMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({
    locale,
    path: "/cart",
    title: t("Cart"),
    description: locale === "ar" ? "مراجعة العناصر وطلب عرض سعر" : "Review items and request a quote.",
    keywords:
      locale === "ar"
        ? ["سلة", "طلب عرض سعر", "منتجات", "مؤسسة شبكة دبي لتقنية المعلومات"]
        : ["cart", "request quote", "products", "Dubai Network IT EST"],
    // Usually carts should not be indexed (optional); keep indexed by default.
    // noindex: true,
  });
}

