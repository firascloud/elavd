import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function storeMetadata(locale: string, query?: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });

  const title = query ? `${query} | ${t("Store")}` : `${t("Store")} | DUBAI NETWORK IT`;
  const description = query
    ? (locale === "ar" ? `نتائج البحث عن ${query}` : `Search results for ${query}`)
    : (locale === "ar" ? "استكشف جميع منتجاتنا" : "Explore all our products");

  return buildMetadata({
    locale,
    path: "/store",
    title,
    description,
    keywords:
      locale === "ar"
        ? ["المتجر", "منتجات", "أنظمة أمنية", "اتصالات", "حلول تقنية"]
        : ["store", "products", "security systems", "communications", "IT solutions"],
  });
}

