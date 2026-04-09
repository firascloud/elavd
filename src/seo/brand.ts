export function getBrandJsonLd(locale: string, brand: {
  id: string | number;
  slug: string;
  name_ar?: string | null;
  name_en?: string | null;
  image_url?: string | null;
}, productsCount?: number) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/store/${brand.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const brandId = `${base}${pagePath}/#brand`;

  const name = locale === "ar" ? brand.name_ar : brand.name_en;
  const description = locale === "ar" 
    ? `استكشف منتجات ${name} في متجرنا.` 
    : `Explore ${name} products in our store.`;

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
          { "@type": "ListItem", position: 2, item: { "@id": `${base}/${locale}/brands`, name: locale === "ar" ? "العلامات التجارية" : "Brands" } },
          { "@type": "ListItem", position: 3, item: { "@id": `${base}${pagePath}`, name } }
        ]
      },
      {
        "@type": "Brand",
        "@id": brandId,
        name,
        description,
        image: brand.image_url || undefined,
        url: `${base}${pagePath}`,
        ...(productsCount ? { "numberOfItems": productsCount } : {})
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": brandId },
        breadcrumb: { "@id": breadcrumbId }
      }
    ]
  };
}

export function getBrandsIndexJsonLd(locale: string) {
    const base = "https://elavd.com";
    const pagePath = `/${locale}/brands`;
    const websiteId = `${base}/#website`;
    
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "url": `${base}${pagePath}`,
      "name": locale === "ar" ? "العلامات التجارية" : "Brands",
      "description": locale === "ar" 
        ? "استكشف مجموعتنا الواسعة من العلامات التجارية والشركات المصنعة المتميزة." 
        : "Explore our wide range of premium brands and manufacturers.",
      "inLanguage": locale,
      "isPartOf": { "@id": websiteId }
    };
}
