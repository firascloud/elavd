import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart } from "./utils";

export async function aboutMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadataSmart({
    locale,
    path: "/about-us",
    title: t("title"),
    description: t("subtitle"),
    keywords:
      locale === "ar"
        ? ["من نحن", "حلول تقنية", "أنظمة أمنية", "شبكات", "الرياض"]
        : ["about us", "IT solutions", "security systems", "networking", "Riyadh"],
  });
}

