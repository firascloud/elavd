import { SITE_LOGO_URL, SITE_URL } from "@/config/site";
import { htmlToPlainText } from "@/lib/text";

export function getProductJsonLd(
  locale: string,
  product: {
    id: string | number;
    slug: string;
    name_ar?: string | null;
    name_en?: string | null;
    short_desc_ar?: string | null;
    short_desc_en?: string | null;
    full_desc_ar?: string | null;
    full_desc_en?: string | null;
    main_image?: string | null;
    sku?: string | null;
    mpn?: string | null;
    price?: number | null;
    rating?: number | null;
    review_count?: number | null;
    images?: string[] | null;
    brand_name_ar?: string | null;
    brand_name_en?: string | null;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder" | null;
  },
  opts?: { categoryName?: string; categorySlug?: string }
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
    product.slug;

  const description = htmlToPlainText(
    (isAr ? product.short_desc_ar : product.short_desc_en) ||
    (isAr ? product.full_desc_ar : product.full_desc_en) ||
    (isAr ? product.short_desc_en : product.short_desc_ar) ||
    (isAr ? product.full_desc_en : product.full_desc_ar)
  );

  const brandName =
    ((isAr ? product.brand_name_ar : product.brand_name_en) ||
      (isAr ? product.brand_name_en : product.brand_name_ar))?.trim();

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const realIdentifier = (value?: string | null) => {
    const identifier = value?.trim();
    return identifier &&
      identifier !== String(product.id).trim() &&
      !uuidPattern.test(identifier)
      ? identifier
      : undefined;
  };
  const sku = realIdentifier(product.sku);
  const mpn = realIdentifier(product.mpn);

  const rawImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...(Array.isArray(product.images) ? product.images : []),
  ]
    .filter((image): image is string => typeof image === "string" && image.trim().length > 0)
    .map((image) => image.trim());
  const images = [...new Set(rawImages)].map((image) =>
    image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${base}${image.startsWith("/") ? "" : "/"}${image}`
  );

  const isPositivePrice = (value?: number | null): value is number =>
    typeof value === "number" && Number.isFinite(value) && value > 0;
  const price = isPositivePrice(product.price) ? product.price : undefined;
  const verifiedAvailability = ["InStock", "OutOfStock", "PreOrder", "BackOrder"].includes(
    product.availability || ""
  )
    ? product.availability
    : undefined;

  const offers =
    price
      ? {
          "@type": "Offer",
          url: `${base}${pagePath}`,
          priceCurrency: "SAR",
          price: String(price),
          ...(verifiedAvailability
            ? { availability: `https://schema.org/${verifiedAvailability}` }
            : {}),
          seller: { "@id": organizationId },
        }
      : undefined;

  const hasRealRating =
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating > 0 &&
    product.rating <= 5 &&
    typeof product.review_count === "number" &&
    Number.isInteger(product.review_count) &&
    product.review_count > 0;

  const aggregateRating = hasRealRating
    ? {
        "@type": "AggregateRating",
        ratingValue: String(product.rating),
        reviewCount: String(product.review_count),
      }
    : undefined;

  // Product is valid Schema.org markup without an Offer or rating, although it
  // will not qualify for Google's Product rich results without eligible data.

  const productNode = {
    "@type": "Product",
    "@id": productId,
    name,
    ...(description ? { description } : {}),
    ...(sku ? { sku } : {}),
    ...(mpn ? { mpn } : {}),
    ...(images?.length ? { image: images } : {}),
    url: `${base}${pagePath}`,
    ...(opts?.categoryName ? { category: opts.categoryName } : {}),
    ...(brandName
      ? {
          brand: {
            "@type": "Brand",
            name: brandName,
          },
        }
      : {}),
    ...(offers ? { offers } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
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
          ...(opts?.categorySlug
            ? [{
                "@type": "ListItem",
                position: 3,
                item: {
                  "@id": `${base}/store/${opts.categorySlug}`,
                  name: opts.categoryName || (isAr ? "القسم" : "Category"),
                },
              }]
            : []),
          {
            "@type": "ListItem",
            position: opts?.categorySlug ? 4 : 3,
            item: {
              "@id": `${base}${pagePath}`,
              name,
            },
          },
        ],
      },
      productNode,
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name,
        ...(description ? { description } : {}),
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": productId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}
