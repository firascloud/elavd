import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "./utils";

export async function storeSlugMetadata(opts: {
  locale: string;
  slug: string;
  title?: string; // already localized if you have it
  description?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale: opts.locale, namespace: "common" });
  const display = opts.title || decodeURIComponent(opts.slug).replace(/-/g, " ");

  return buildMetadata({
    locale: opts.locale,
    path: `/store/${opts.slug}`,
    title: `${display} | ${t("Store")}`,
    description:
      opts.description ||
      (opts.locale === "ar" ? `نتائج عن ${display}` : `Results for ${display}`),
    keywords:
      opts.locale === "ar"
        ? ["المتجر", display, "منتجات", "بحث"]
        : ["store", display, "products", "results"],
  });
}

