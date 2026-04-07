export function getProductJsonLd(locale: string, product: {
  id: string | number
  slug: string
  name_ar?: string
  name_en?: string
  short_desc_ar?: string
  short_desc_en?: string
  main_image?: string
  sku?: string
}) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/product/${product.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const productId = `${base}${pagePath}/#product`;

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description = locale === "ar" ? product.short_desc_ar : product.short_desc_en;

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
        image: product.main_image ? [product.main_image] : undefined,
        url: `${base}${pagePath}`,
        brand: { "@type": "Organization", "@id": organizationId }
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

