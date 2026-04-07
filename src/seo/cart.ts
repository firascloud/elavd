export function getCartJsonLd(locale: string) {
    const base = "https://elavd.com";
    const pagePath = `/${locale}/cart`;
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
            },
            {
                "@type": "Organization",
                "@id": organizationId,
                name: "Dubai Network IT EST",
                url: base,
            },
            {
                "@type": "BreadcrumbList",
                "@id": breadcrumbId,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        item: { "@id": `${base}/${locale}`, name: locale === "ar" ? "الرئيسية" : "Home" },
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        item: { "@id": `${base}${pagePath}`, name: locale === "ar" ? "السلة" : "Cart" },
                    },
                ],
            },
            {
                "@type": "WebPage",
                "@id": webPageId,
                url: `${base}${pagePath}`,
                name: locale === "ar" ? "السلة" : "Cart",
                description:
                    locale === "ar"
                        ? "مراجعة العناصر وطلب عرض سعر"
                        : "Review items and request a quote.",
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": organizationId },
                breadcrumb: { "@id": breadcrumbId },
                potentialAction: [
                    {
                        "@type": "Action",
                        name: locale === "ar" ? "طلب عرض سعر" : "Request Quote",
                    },
                ],
            },
        ],
    };
}

