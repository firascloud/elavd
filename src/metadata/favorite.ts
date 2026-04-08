import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function favoriteMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "common" });
    return buildMetadata({
        locale,
        path: "/favorite",
        title: t("Wishlist"),
        description: locale === "ar" ? "المنتجات المفضلة لديك" : "Your favorite products",
        keywords:
            locale === "ar"
                ? ["مفضلة", "قائمة الرغبات", "منتجات", "متجر"]
                : ["wishlist", "favorites", "products", "store"],
        // noindex: true, // optional if you don't want indexing
    });
}

