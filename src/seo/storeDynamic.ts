export function getStoreDynamicJsonLd(locale: string, data: {
  isCategory: boolean
  slug: string
  name?: string
}) {
  const base = "https://elavd.com";
  const path = data.isCategory ? `/product-category/${data.slug}` : `/store/${data.slug}`;
  const pagePath = `/${locale}${path}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const pageName = data.name || decodeURIComponent(data.slug).replace(/-/g, " ");

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
          { "@type": "ListItem", position: 3, item: { "@id": `${base}${pagePath}`, name: pageName } }
        ]
      },
      {
        "@type": data.isCategory ? "CollectionPage" : "SearchResultsPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: pageName,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId }
      }
    ]
  };
}

