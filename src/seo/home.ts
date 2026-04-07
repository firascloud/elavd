export function getHomeJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: base,
        name: "Dubai Network IT EST",
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: `${base}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Dubai Network IT EST",
        url: base,
        logo: `${base}/logo.png`,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+966553202091",
            areaServed: ["SA"],
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
            item: { "@id": `${base}${pagePath}`, name: locale === "ar" ? "الرئيسية" : "Home" },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: locale === "ar" ? "الرئيسية" : "Home",
        description:
          locale === "ar"
            ? "مؤسسة رائدة تقدم حلول وخدمات وتقنيات المعلومات"
            : "Leading IT establishment offering technology solutions, services and products.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": organizationId },
      },
    ],
  };
}

