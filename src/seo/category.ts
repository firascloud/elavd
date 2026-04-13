export function getCategoryJsonLd(
  locale: string,
  category: {
    slug: string;
    name_ar?: string;
    name_en?: string;
    description_ar?: string;
    description_en?: string;
  }
) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/product-category/${category.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const collectionId = `${base}${pagePath}/#collection`;

  const isAr = locale === "ar";

  const name =
    (isAr ? category.name_ar : category.name_en) ||
    (isAr ? category.name_en : category.name_ar) ||
    "Category";

  const description =
    (isAr ? category.description_ar : category.description_en) ||
    (isAr
      ? `استكشف قسم ${name} لدى مؤسسة إيلافد في السعودية، ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية بجودة عالية وخدمة موثوقة.`
      : `Explore the ${name} category at Elavd in Saudi Arabia, featuring specialized office equipment and security solutions with reliable service and quality.`);

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
            contactType: "customer support",
            email: "sales@elavd.com",
            telephone: "+966553202091",
            areaServed: "SA",
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
            item: {
              "@id": `${base}/${locale}`,
              name: isAr ? "الرئيسية" : "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${base}/${locale}/store`,
              name: isAr ? "المتجر" : "Store",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `${base}${pagePath}`,
              name,
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr ? `${name} | مؤسسة إيلافد` : `${name} | Elavd`,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": collectionId },
      },
      {
        "@type": "CollectionPage",
        "@id": collectionId,
        url: `${base}${pagePath}`,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}