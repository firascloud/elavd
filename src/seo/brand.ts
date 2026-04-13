export function getBrandJsonLd(
  locale: string,
  brand: {
    id: string | number;
    slug: string;
    name_ar?: string | null;
    name_en?: string | null;
    image_url?: string | null;
  },
  productsCount?: number
) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/store/${brand.slug}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const brandPageId = `${base}${pagePath}/#brandpage`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
  const brandId = `${base}${pagePath}/#brand`;

  const isAr = locale === "ar";
  const name =
    (isAr ? brand.name_ar : brand.name_en) ||
    (isAr ? brand.name_en : brand.name_ar) ||
    "Brand";

  const description = isAr
    ? `استكشف منتجات ${name} لدى مؤسسة إيلافد في السعودية، ضمن حلول متخصصة في الأجهزة المكتبية والأنظمة الأمنية تشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والباركود.`
    : `Explore ${name} products at Elavd in Saudi Arabia across specialized office equipment and security solutions including attendance devices, safes, money counting machines, and card and barcode printers.`;

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
              "@id": `${base}/${locale}/brands`,
              name: isAr ? "العلامات التجارية" : "Brands",
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
        "@type": "Brand",
        "@id": brandId,
        name,
        description,
        image: brand.image_url || undefined,
        url: `${base}${pagePath}`,
        ...(productsCount ? { numberOfItems: productsCount } : {}),
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr ? `${name} | مؤسسة إيلافد` : `${name} | Elavd`,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": brandPageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "CollectionPage",
        "@id": brandPageId,
        url: `${base}${pagePath}`,
        name: isAr ? `${name} | مؤسسة إيلافد` : `${name} | Elavd`,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": brandId },
        publisher: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}

export function getBrandsIndexJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/brands`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const collectionPageId = `${base}${pagePath}/#collection`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const isAr = locale === "ar";
  const name = isAr ? "العلامات التجارية" : "Brands";
  const description = isAr
    ? "استكشف العلامات التجارية المتوفرة لدى مؤسسة إيلافد في السعودية ضمن مجموعة متخصصة من أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والبطاقات والباركود."
    : "Explore the brands available at Elavd in Saudi Arabia across a specialized range of attendance devices, safes, money counting machines, and card and barcode printers.";

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
              name,
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "العلامات التجارية | مؤسسة إيلافد"
          : "Brands | Elavd",
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": collectionPageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "CollectionPage",
        "@id": collectionPageId,
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