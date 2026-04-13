export function getCartJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/cart`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const cartPageId = `${base}${pagePath}/#cartpage`;
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
              name: isAr ? "سلة التسوق" : "Shopping Cart",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "سلة التسوق | مؤسسة إيلافد"
          : "Shopping Cart | Elavd",
        description: isAr
          ? "راجع العناصر المضافة إلى السلة وأرسل طلبك بسهولة من مؤسسة إيلافد."
          : "Review the items added to your cart and submit your request easily with Elavd.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": cartPageId },
        breadcrumb: { "@id": breadcrumbId },
        potentialAction: [
          {
            "@type": "Action",
            name: isAr ? "إرسال الطلب" : "Submit Request",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": cartPageId,
        url: `${base}${pagePath}`,
        name: isAr ? "سلة التسوق" : "Shopping Cart",
        description: isAr
          ? "صفحة سلة التسوق لمراجعة المنتجات المختارة قبل إرسال الطلب."
          : "Shopping cart page for reviewing selected products before submitting the request.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}