export function getStoreDynamicJsonLd(
  locale: string,
  data: {
    isCategory: boolean;
    slug: string;
    name?: string;
  }
) {
  const base = "https://elavd.com";
  const path = data.isCategory ? `/product-category/${data.slug}` : `/store/${data.slug}`;
  const pagePath = `/${locale}${path}`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const mainEntityId = `${base}${pagePath}${data.isCategory ? "#collection" : "#item"}`;
  const breadcrumbId = `${base}${pagePath}/#breadcrumb`;

  const isAr = locale === "ar";
  const pageName = data.name || decodeURIComponent(data.slug).replace(/-/g, " ");

  const pageDescription = data.isCategory
    ? isAr
      ? `${pageName} ضمن متجر مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات في السعودية. تصفح المنتجات والحلول المتخصصة بجودة عالية وخدمة موثوقة.`
      : `${pageName} in the Elavd Office Equipment & Communication Technology store in Saudi Arabia. Browse specialized products and solutions with reliable service and quality.`
    : isAr
      ? `${pageName} من مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات في السعودية، ضمن حلول متخصصة تشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات الكروت والباركود.`
      : `${pageName} from Elavd Office Equipment & Communication Technology in Saudi Arabia, within specialized solutions including attendance devices, safes, money counting machines, and card and barcode printers.`;

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
              "@id": `${base}/${locale}/store`,
              name: isAr ? "المتجر" : "Store",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `${base}${pagePath}`,
              name: pageName,
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
        mainEntity: { "@id": mainEntityId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": data.isCategory ? "CollectionPage" : "Product",
        "@id": mainEntityId,
        url: `${base}${pagePath}`,
        name: pageName,
        description: pageDescription,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        brand: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}