export function getStoreJsonLd(locale: string, opts: { query?: string } = {}) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/store`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const isSearch = Boolean(opts.query);
  const pageName = isSearch
    ? (locale === "ar" ? `نتائج البحث: ${opts.query}` : `Search results: ${opts.query}`)
    : (locale === "ar" ? "المتجر" : "Store");

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
          { "@type": "ListItem", position: 2, item: { "@id": `${base}${pagePath}`, name: locale === "ar" ? "المتجر" : "Store" } }
        ]
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: pageName,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId }
      },
      {
        "@type": isSearch ? "SearchResultsPage" : "CollectionPage",
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

