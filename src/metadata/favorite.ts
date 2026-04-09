import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function favoriteMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "common" });
    return buildMetadata({
        locale,
        path: "/favorite",
        title: t("Wishlist"),
        description: locale === "ar"
            ? "احفظ منتجاتك المفضلة من أنظمة الأمن والمراقبة والاتصالات لمراجعتها لاحقاً أو طلب عرض سعر مباشرة من قائمة رغباتك."
            : "Save your favorite security systems, surveillance cameras and IT products to review later or request a quote directly from your wishlist.",
        keywords:
            locale === "ar"
                ? ["مفضلة", "قائمة الرغبات", "منتجات", "متجر"]
                : ["wishlist", "favorites", "products", "store"],
        // Favorite is a user-state page — empty for bots, noindexed to preserve crawl budget
        noindex: true,
    });
}
