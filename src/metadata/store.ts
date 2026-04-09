import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function storeMetadata(locale: string, query?: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });

  const title = query ? `${query} | ${t("Store")}` : `${t("Store")} | DUBAI NETWORK IT`;
  const description = query
    ? (locale === "ar"
        ? `نتائج البحث عن "${query}" — تصفح أنظمة الأمن والمراقبة وحلول تقنية الاتصالات من أبرز العلامات التجارية العالمية.`
        : `Search results for "${query}" — browse security systems, surveillance equipment and IT communication solutions.`)
    : (locale === "ar"
        ? "تصفح متجر إيلافد واستكشف مجموعة واسعة من أنظمة الأمن والمراقبة وشبكات الاتصالات وحلول تقنية المعلومات من علامات تجارية عالمية موثوقة."
        : "Browse the Elavd store and discover a wide range of security systems, surveillance cameras, networking equipment and IT solutions from trusted global brands.");

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

