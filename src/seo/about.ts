export function getAboutJsonLd(locale: string) {
    const base = "https://elavd.com";
    const pagePath = `/${locale}/about-us`;
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
                logo: `${base}/placeholder-logo.svg`,
                sameAs: [
                    // Add socials if available
                ],
                contactPoint: [
                    {
                        "@type": "ContactPoint",
                        contactType: "customer support",
                        telephone: "+966553202091",
                        email: "sales@elavd.com",
                        availableLanguage: ["ar", "en"],
                    },
                ],
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
                        item: { "@id": `${base}/${locale}`, name: locale === "ar" ? "الرئيسية" : "Home" },
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        item: { "@id": `${base}${pagePath}`, name: locale === "ar" ? "من نحن" : "About Us" },
                    },
                ],
            },
            {
                "@type": "AboutPage",
                "@id": webPageId,
                url: `${base}${pagePath}`,
                name: locale === "ar" ? "من نحن" : "About Us",
                description:
                    locale === "ar"
                        ? "تعرف على رؤيتنا ورسالتنا وفريقنا وخبراتنا"
                        : "Learn about our vision, mission, team, and experience.",
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": organizationId },
                breadcrumb: { "@id": breadcrumbId },
            },
        ],
    };
}

