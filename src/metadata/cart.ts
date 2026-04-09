import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function cartMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({
    locale,
    path: "/cart",
    title: t("Cart"),
    description: locale === "ar"
      ? "راجع المنتجات التي أضفتها إلى السلة وأرسل طلب عرض سعر لأنظمة الأمن وتقنية الاتصالات. فريق إيلافد جاهز للرد على استفساراتك."
      : "Review the security systems and IT products in your cart and submit a quote request. The Elavd team will respond with pricing details promptly.",
    keywords:
      locale === "ar"
        ? ["سلة", "طلب عرض سعر", "منتجات", "شركة إيلافد للأنظمة الأمنية وتقنية الاتصالات"]
        : ["cart", "request quote", "products", "Dubai Network IT EST"],
    
    noindex: true,
  });
}

