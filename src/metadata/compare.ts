import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function compareMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "common" });
    return buildMetadata({
        locale,
        path: "/compare",
        title: t("Compare"),
        description: locale === "ar"
            ? "قارن بين أنظمة الأمن وكاميرات المراقبة وأجهزة الاتصالات جنباً إلى جنب لتحديد المنتج الأنسب لاحتياجاتك بدقة واحترافية."
            : "Compare security systems, surveillance cameras and communication devices side by side to find the product that best matches your requirements.",
        keywords:
            locale === "ar"
                ? ["مقارنة", "مقارنة منتجات", "اختيار المنتج", "متجر"]
                : ["compare", "product comparison", "choose product", "store"],
        // Compare is a user-state page — empty for bots, noindexed to preserve crawl budget
        noindex: true,
    });
}
