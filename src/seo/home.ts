export function getHomeJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
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
        potentialAction: {
          "@type": "SearchAction",
          target: `${base}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
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
          ? "مؤسسة إيلافد متخصصة في الأجهزة المكتبية والأنظمة الأمنية في السعودية، وتشمل مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود."
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
              "@id": `${base}${pagePath}`,
              name: isAr ? "الرئيسية" : "Home",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
          : "Elavd Office Equipment & Communication Technology",
        description: isAr
          ? "مؤسسة إيلافد توفر أفضل حلول الأجهزة المكتبية والأنظمة الأمنية في السعودية، تشمل مكائن عد النقود، الخزنات الحديدية، أجهزة البصمة، وأنظمة الحضور والانصراف وطابعات الكروت."
          : "Elavd provides the best office equipment and security solutions in Saudi Arabia including money counting machines, safes, attendance devices, time attendance systems, and card printers.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": organizationId },
      },
    ],
  };
}