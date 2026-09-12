import { SITE_LOGO_URL, SITE_URL } from "@/config/site";

export function getProductJsonLd(
  locale: string,
  product: {
    id: string | number;
    slug: string;
    name_ar?: string;
    name_en?: string;
    short_desc_ar?: string;
    short_desc_en?: string;
    main_image?: string;
    sku?: string;
    price?: number | null;
    discount_price?: number | null;
    rating?: number | null;
    review_count?: number | null;
    images?: string[];
    brand_name_ar?: string | null;
    brand_name_en?: string | null;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder" | null;
  },
  opts?: { categoryName?: string }
) {
  const base = SITE_URL;
  const pagePath = `/product/${product.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const productId = `${base}${pagePath}/#product`;

  const isAr = locale === "ar";

  const name =
    (isAr ? product.name_ar : product.name_en) ||
    (isAr ? product.name_en : product.name_ar) ||
    "Product";

  const description =
    (isAr ? product.short_desc_ar : product.short_desc_en) ||
    (isAr ? product.short_desc_en : product.short_desc_ar) ||
    (isAr
      ? `اكتشف ${name} لدى مؤسسة إيلافد في السعودية ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية.`
      : `Discover ${name} at Elavd in Saudi Arabia within specialized office equipment and security solutions.`);

  const brandName =
    (isAr ? product.brand_name_ar : product.brand_name_en) ||
    (isAr ? product.brand_name_en : product.brand_name_ar) ||
    "Elavd";

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.main_image
        ? [product.main_image]
        : undefined;

  const price =
    typeof product.discount_price === "number" && product.discount_price > 0
      ? product.discount_price
      : product.price;

  const offers =
    typeof price === "number" && Number.isFinite(price) && price > 0
      ? {
          "@type": "Offer",
          url: `${base}${pagePath}`,
          priceCurrency: "SAR",
          price: String(price),
          ...(product.availability
            ? { availability: `https://schema.org/${product.availability}` }
            : {}),
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": organizationId },
        }
      : undefined;

  const hasRealRating =
    typeof product.rating === "number" &&
    typeof product.review_count === "number" &&
    product.review_count > 0;

  const aggregateRating = hasRealRating
    ? {
        "@type": "AggregateRating",
        ratingValue: String(Math.max(0, Math.min(5, product.rating!)).toFixed(1)),
        reviewCount: String(product.review_count),
      }
    : undefined;

  // Google requires a real offer, review, or aggregate rating for Product
  // rich results. Quote-only products have none of these, so marking them as
  // Product would create an invalid structured-data item in Search Console.
  const hasProductRichResultData = Boolean(offers || aggregateRating);

  const productNode = {
    "@type": "Product",
    "@id": productId,
    name,
    description,
    sku: product.sku || String(product.id),
    image: images,
    url: `${base}${pagePath}`,
    category: opts?.categoryName,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers,
    aggregateRating,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: base,
        name: isAr
          ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
          : "Elavd Office Equipment & Communication Technology Establishment",
        inLanguage: locale,
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: isAr
          ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
          : "Elavd Office Equipment & Communication Technology Establishment",
        alternateName: "Elavd",
        url: base,
        logo: SITE_LOGO_URL,
        email: "sales@elavd.com",
        telephone: "+966553202091",
        areaServed: "SA",
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "sales@elavd.com",
            telephone: "+966553202091",
            areaServed: "SA",
            availableLanguage: ["ar", "en"],
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": base,
              name: isAr ? "الرئيسية" : "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${base}/store`,
              name: isAr ? "المتجر" : "Store",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `${base}${pagePath}`,
              name,
            },
          },
        ],
      },
      ...(hasProductRichResultData ? [productNode] : []),
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        ...(hasProductRichResultData ? { mainEntity: { "@id": productId } } : {}),
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}
