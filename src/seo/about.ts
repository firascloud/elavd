export function getAboutJsonLd(locale: string) {
    const base = "https://elavd.com";
    const pagePath = `/${locale}/about-us`;
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
            },
            {
                "@type": "Organization",
                "@id": organizationId,
                name: isAr
                    ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
                    : "Elavd Office Equipment & Communication Technology Establishment",
                alternateName: "Elavd",
                url: base,
                logo: `${base}/placeholder-logo.svg`,
                email: "sales@elavd.com",
                telephone: "+966553202091",
                sameAs: [],
                contactPoint: [
                    {
                        "@type": "ContactPoint",
                        contactType: "customer support",
                        telephone: "+966553202091",
                        email: "sales@elavd.com",
                        availableLanguage: ["ar", "en"],
                        areaServed: "SA",
                    },
                ],
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Riyadh",
                },
                areaServed: "SA",
                description: isAr
                    ? "مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات متخصصة في حلول الأجهزة المكتبية والأنظمة الأمنية في المملكة العربية السعودية، وتشمل أجهزة البصمة، الخزن الحديدية، مكائن عد النقود، وطابعات البطاقات والباركود."
                    : "Elavd Office Equipment & Communication Technology Establishment specializes in office equipment and security solutions in Saudi Arabia, including attendance devices, safes, money counting machines, and card and barcode printers.",
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
                            name: isAr ? "من نحن" : "About Us",
                        },
                    },
                ],
            },
            {
                "@type": "AboutPage",
                "@id": webPageId,
                url: `${base}${pagePath}`,
                name: isAr
                    ? "من نحن | مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات"
                    : "About Us | Elavd Office Equipment & Communication Technology Establishment",
                description: isAr
                    ? "تعرّف على مؤسسة إيلافد للأجهزة المكتبية وتقنيات الاتصالات، المتخصصة في حلول الأجهزة المكتبية والأنظمة الأمنية في السعودية."
                    : "Learn about Elavd Office Equipment & Communication Technology Establishment, specialized in office equipment and security solutions in Saudi Arabia.",
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": organizationId },
                breadcrumb: { "@id": breadcrumbId },
            },
        ],
    };
}