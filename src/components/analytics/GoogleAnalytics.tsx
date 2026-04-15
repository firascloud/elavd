"use client";

import Script from 'next/script';
import { usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_TRACKING_ID, GADS_TRACKING_ID, trackPageView } from '@/lib/analytics';

function GoogleAnalyticsInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track pageviews automatically on route change
    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            trackPageView(url);
        }
    }, [pathname, searchParams]);

    if (!GA_TRACKING_ID) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        // Configure GA4
                        gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                        });

                        // Configure Google Ads if tracking ID exists
                        ${GADS_TRACKING_ID ? `gtag('config', '${GADS_TRACKING_ID}');` : ''}
                    `,
                }}
            />
        </>
    );
}

export default function GoogleAnalytics() {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsInner />
        </Suspense>
    );
}
