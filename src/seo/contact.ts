export function getContactJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/contact-us`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const contactPageId = `${base}${pagePath}/#contactpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const contactPointId = `${organizationId}/contact-point`;

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
        contactPoint: [
          {
            "@type": "ContactPoint",
            "@id": contactPointId,
            contactType: "customer support",
            email: "sales@elavd.com",
            telephone: "+966553202091",
            areaServed: "SA",
            availableLanguage: ["ar", "en"],
          },
        ],
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
              "@id": `${base}/${locale}`,
              name: isAr ? "الرئيسية" : "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${base}${pagePath}`,
              name: isAr ? "اتصل بنا" : "Contact Us",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "اتصل بنا | مؤسسة إيلافد"
          : "Contact Us | Elavd",
        description: isAr
          ? "تواصل مع مؤسسة إيلافد في السعودية للاستفسار عن مكائن عد النقود، الخزن الحديدية، أجهزة البصمة، أجهزة الحضور والانصراف، وطابعات الكروت والباركود."
          : "Contact Elavd in Saudi Arabia for inquiries about money counting machines, safes, attendance devices, time attendance systems, and card and barcode printers.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": contactPageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "ContactPage",
        "@id": contactPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "اتصل بنا | مؤسسة إيلافد"
          : "Contact Us | Elavd",
        description: isAr
          ? "تواصل معنا للاستفسار عن منتجات مؤسسة إيلافد وخدماتها في السعودية، بما يشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت."
          : "Get in touch with Elavd in Saudi Arabia for product and service inquiries including attendance devices, safes, money counting machines, and card printers.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}