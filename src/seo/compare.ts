export function getCompareJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/compare`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const comparePageId = `${base}${pagePath}/#comparepage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const isAr = locale === "ar";

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
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
        },
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
              name: isAr ? "مقارنة المنتجات" : "Product Comparison",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "مقارنة المنتجات | مؤسسة إيلافد"
          : "Product Comparison | Elavd",
        description: isAr
          ? "قارن بين المنتجات جنباً إلى جنب لاختيار الأنسب من أجهزة البصمة والحضور والانصراف، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات."
          : "Compare products side by side to choose the best fit across attendance devices, safes, money counting machines, and card printers.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": comparePageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "CollectionPage",
        "@id": comparePageId,
        url: `${base}${pagePath}`,
        name: isAr ? "مقارنة المنتجات" : "Product Comparison",
        description: isAr
          ? "صفحة مقارنة المنتجات في متجر مؤسسة إيلافد لمساعدتك على اختيار المنتج الأنسب حسب المواصفات والاحتياجات."
          : "Product comparison page in the Elavd store to help you choose the most suitable product based on specifications and needs.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}