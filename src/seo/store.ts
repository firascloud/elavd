export function getStoreJsonLd(locale: string, opts: { query?: string } = {}) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/store`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const collectionPageId = `${base}${pagePath}${opts.query ? `?q=${encodeURIComponent(opts.query)}` : ""}#collection`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const isAr = locale === "ar";
  const isSearch = Boolean(opts.query);

  const pageName = isSearch
    ? isAr
      ? `نتائج البحث: ${opts.query}`
      : `Search results: ${opts.query}`
    : isAr
      ? "المتجر"
      : "Store";

  const pageDescription = isSearch
    ? isAr
      ? `نتائج البحث عن "${opts.query}" في متجر مؤسسة إيلافد، المتخصص في مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود في السعودية.`
      : `Search results for "${opts.query}" in Elavd store, specializing in money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers in Saudi Arabia.`
    : isAr
      ? "متجر مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات، ويضم مجموعة متخصصة من مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والبطاقات والباركود في السعودية."
      : "Elavd Office Equipment & Communication Technology store offers a specialized range of money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers in Saudi Arabia.";

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
        logo: `${base}/logo.png`,
        email: "sales@elavd.com",
        telephone: "+966553202091",
        areaServed: "SA",
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+966553202091",
            email: "sales@elavd.com",
            areaServed: "SA",
            availableLanguage: ["ar", "en"],
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
        },
        description: isAr
          ? "مؤسسة إيلافد متخصصة في الأجهزة المكتبية والأنظمة الأمنية في السعودية، بما يشمل مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود."
          : "Elavd specializes in office equipment and security systems in Saudi Arabia, including money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": `${base}/${locale}`,
              name: isAr ? "الرئيسية" : "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${base}${pagePath}`,
              name: isAr ? "المتجر" : "Store",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: pageName,
        description: pageDescription,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": collectionPageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": isSearch ? "SearchResultsPage" : "CollectionPage",
        "@id": collectionPageId,
        url: `${base}${pagePath}${isSearch ? `?q=${encodeURIComponent(opts.query!)}` : ""}`,
        name: pageName,
        description: pageDescription,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}