import type { MetadataRoute } from "next";

const BASE_URL = "https://elavd.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: [
                    // Optional private paths; add more as needed
                    "/api/",
                    "/admin/",
                ],
            },
        ],
        sitemap: [`${BASE_URL}/sitemap.xml`],
        host: BASE_URL,
    };
}

