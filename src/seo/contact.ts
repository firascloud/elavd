export function getContactJsonLd(locale: string) {
    const base = "https://elavd.com";
    const pagePath = `/${locale}/contact-us`;
    const websiteId = `${base}/#website`;
    const organizationId = `${base}/#organization`;
    const webPageId = `${base}${pagePath}/#webpage`;
    const breadcrumbId = `${base}${pagePath}/#breadcrumb`;
    const contactPointId = `${organizationId}/contact-point`;

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
                contactPoint: [
                    {
                        "@type": "ContactPoint",
                        "@id": contactPointId,
                        contactType: "customer support",
                        email: "info@dneest.com",
                        telephone: "+966553202091",
                        areaServed: ["SA"],
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
                        item: { "@id": base, name: locale === "ar" ? "الرئيسية" : "Home" },
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        item: {
                            "@id": `${base}${pagePath}`,
                            name: locale === "ar" ? "اتصل بنا" : "Contact Us",
                        },
                    },
                ],
            },
            {
                "@type": "WebPage",
                "@id": webPageId,
                url: `${base}${pagePath}`,
                name: locale === "ar" ? "اتصل بنا" : "Contact Us",
                description:
                    locale === "ar"
                        ? "تواصل معنا للاستفسارات والدعم الفني"
                        : "Get in touch for inquiries and technical support",
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": organizationId },
                breadcrumb: { "@id": breadcrumbId },
            },
            {
                "@type": "ContactPage",
                "@id": webPageId,
                url: `${base}${pagePath}`,
                name: locale === "ar" ? "اتصل بنا" : "Contact Us",
                description:
                    locale === "ar"
                        ? "تواصل معنا للاستفسارات والدعم الفني"
                        : "Get in touch for inquiries and technical support",
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": organizationId },
                breadcrumb: { "@id": breadcrumbId },
            },
        ],
    };
}

