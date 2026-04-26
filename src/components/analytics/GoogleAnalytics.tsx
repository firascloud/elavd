"use client";

import Script from 'next/script';
import { usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { GA_TRACKING_ID, GADS_TRACKING_ID, trackPageView } from '@/lib/analytics';

function GoogleAnalyticsInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [shouldLoad, setShouldLoad] = useState(false);

    // Defer analytics loading until after the page is interactive
    useEffect(() => {
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => setShouldLoad(true), { timeout: 3000 });
        } else {
            // Fallback: load after 2 seconds
            const timer = setTimeout(() => setShouldLoad(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Track pageviews automatically on route change
    useEffect(() => {
        if (pathname && shouldLoad) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            trackPageView(url);
        }
    }, [pathname, searchParams, shouldLoad]);

    if (!GA_TRACKING_ID || !shouldLoad) return null;

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="lazyOnload"
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
