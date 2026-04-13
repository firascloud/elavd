export function getFavoriteJsonLd(locale: string) {
  const base = "https://elavd.com";
  const pagePath = `/${locale}/favorite`;
  const websiteId = `${base}/#website`;
  const organizationId = `${base}/#organization`;
  const webPageId = `${base}${pagePath}/#webpage`;
  const favoritePageId = `${base}${pagePath}/#favoritepage`;
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
              name: isAr ? "قائمة المفضلة" : "Wishlist",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: `${base}${pagePath}`,
        name: isAr
          ? "قائمة المفضلة | مؤسسة إيلافد"
          : "Wishlist | Elavd",
        description: isAr
          ? "احفظ منتجاتك المفضلة لدى مؤسسة إيلافد لمراجعتها لاحقاً."
          : "Save your favorite products at Elavd for later review.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": favoritePageId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "CollectionPage",
        "@id": favoritePageId,
        url: `${base}${pagePath}`,
        name: isAr ? "قائمة المفضلة" : "Wishlist",
        description: isAr
          ? "صفحة المنتجات المفضلة المحفوظة للمراجعة لاحقاً."
          : "Saved favorite products page for later review.",
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
    ],
  };
}