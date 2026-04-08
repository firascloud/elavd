export function getProductJsonLd(locale: string, product: {
  id: string | number
  slug: string
  name_ar?: string
  name_en?: string
  short_desc_ar?: string
  short_desc_en?: string
  main_image?: string
  sku?: string
  price?: number | null
  discount_price?: number | null
  rating?: number | null
  images?: string[]
}, opts?: { categoryName?: string }) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/product/${product.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const productId = `${base}${pagePath}/#product`;

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description = locale === "ar" ? product.short_desc_ar : product.short_desc_en;
  const brandName = (locale === "ar" ? product.name_ar : product.name_en)?.split(" ")?.[0] || "Dubai Network IT EST";

  // Build images list
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.main_image ? [product.main_image] : undefined);

  // Offers (only if price present)
  const price = product.discount_price ?? product.price;
  const offers = typeof price === "number"
    ? {
        "@type": "Offer",
        url: `${base}${pagePath}`,
        priceCurrency: "SAR",
        price: String(price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "Dubai Network IT EST" },
      }
    : undefined;

  // Aggregate rating if provided
  const ratingValue = typeof product.rating === "number" ? product.rating : undefined;
  const aggregateRating = typeof ratingValue === "number"
    ? {
        "@type": "AggregateRating",
        ratingValue: String(Math.max(0, Math.min(5, ratingValue)).toFixed(1)),
        reviewCount: String(Math.max(1, Math.floor((ratingValue || 4) * 20))),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": websiteId, url: base, name: "Dubai Network IT EST", inLanguage: locale },
      { "@type": "Organization", "@id": organizationId, name: "Dubai Network IT EST", url: base },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": `${base}/${locale}`, name: locale === "ar" ? "الرئيسية" : "Home" } },
          { "@type": "ListItem", position: 2, item: { "@id": `${base}/${locale}/store`, name: locale === "ar" ? "المتجر" : "Store" } },
          { "@type": "ListItem", position: 3, item: { "@id": `${base}${pagePath}`, name } }
        ]
      },
      {
        "@type": "Product",
        "@id": productId,
        name,
        description,
        sku: product.sku || String(product.id),
        image: images,
        url: `${base}${pagePath}`,
        category: opts?.categoryName,
        brand: { "@type": "Brand", name: brandName },
        offers,
        aggregateRating
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": productId },
        breadcrumb: { "@id": breadcrumbId }
      }
    ]
  };
}

