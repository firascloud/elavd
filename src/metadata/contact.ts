import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadataSmart } from "./utils";

export async function contactMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "contact" });
    return buildMetadataSmart({
        locale,
        path: "/contact-us",
        title: t("title"),
        description: t("subtitle"),
        keywords:
            locale === "ar"
                ? ["اتصل بنا", "تواصل", "دعم", "الرياض", "السعودية"]
                : ["contact", "support", "inquiry", "Riyadh", "Saudi Arabia"],
    });
}

