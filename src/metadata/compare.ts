import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function compareMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "common" });
    return buildMetadata({
        locale,
        path: "/compare",
        title: t("Compare"),
        description: locale === "ar" ? "قارن بين المنتجات لاختيار الأفضل" : "Compare products to choose the best option.",
        keywords:
            locale === "ar"
                ? ["مقارنة", "مقارنة منتجات", "اختيار المنتج", "متجر"]
                : ["compare", "product comparison", "choose product", "store"],
    });
}

