import type { Metadata } from "next";
import { buildMetadata } from "./utils";

function getStoreSlugFallbackKeywords(locale: string, display: string, slug: string): string[] {
  const isAr = locale === "ar";
  const s = slug.toLowerCase();

  if (isAr) {
    if (
      s.includes("fingerprint") ||
      s.includes("attendance") ||
      s.includes("time-attendance") ||
      s.includes("biometric")
    ) {
      return [display, "أجهزة البصمة", "جهاز بصمة", "أجهزة حضور وانصراف", "نظام حضور وانصراف", "السعودية"];
    }

    if (s.includes("safe") || s.includes("safes") || s.includes("vault")) {
      return [display, "الخزن الحديدية", "خزنات حديدية", "خزنة حديد", "خزنة إلكترونية", "السعودية"];
    }

    if (
      s.includes("money") ||
      s.includes("cash") ||
      s.includes("counting") ||
      s.includes("counter")
    ) {
      return [display, "مكائن عد النقود", "ماكينة عد نقود", "جهاز عد فلوس", "السعودية"];
    }

    if (s.includes("card") || s.includes("printer") || s.includes("pvc")) {
      return [display, "طابعات الكروت", "طابعة كروت", "طابعة بطاقات", "طابعة PVC", "السعودية"];
    }

    return [display, "متجر إيلافد", "الأجهزة المكتبية في السعودية", "السعودية"];
  }

  if (
    s.includes("fingerprint") ||
    s.includes("attendance") ||
    s.includes("time-attendance") ||
    s.includes("biometric")
  ) {
    return [display, "attendance devices", "fingerprint device", "time attendance system", "Saudi Arabia"];
  }

  if (s.includes("safe") || s.includes("safes") || s.includes("vault")) {
    return [display, "safes", "safe box", "electronic safes", "Saudi Arabia"];
  }

  if (
    s.includes("money") ||
    s.includes("cash") ||
    s.includes("counting") ||
    s.includes("counter")
  ) {
    return [display, "money counting machines", "cash counting machine", "money counter", "Saudi Arabia"];
  }

  if (s.includes("card") || s.includes("printer") || s.includes("pvc")) {
    return [display, "card printers", "ID card printer", "PVC card printer", "Saudi Arabia"];
  }

  return [display, "Elavd store", "office equipment Saudi Arabia", "Saudi Arabia"];
}

export async function storeSlugMetadata(opts: {
  locale: string;
  slug: string;
  title?: string;
  description?: string;
}): Promise<Metadata> {
  const isAr = opts.locale === "ar";
  const display = opts.title || decodeURIComponent(opts.slug).replace(/-/g, " ");

  return buildMetadata({
    locale: opts.locale,
    path: `/store/${opts.slug}`,
    title: isAr
      ? `${display} | متجر مؤسسة إيلافد في السعودية`
      : `${display} | Elavd Store in Saudi Arabia`,
    description:
      opts.description ||
      (isAr
        ? `استكشف ${display} لدى متجر مؤسسة إيلافد في السعودية، ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية بجودة عالية وخدمة موثوقة.`
        : `Explore ${display} at the Elavd store in Saudi Arabia, featuring specialized office equipment and security solutions with reliable service and quality.`),
    keywords: getStoreSlugFallbackKeywords(opts.locale, display, opts.slug),
  });
}