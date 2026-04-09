import React from 'react';
import BrandsClient from './BrandsClient';
import { Metadata } from 'next';
import { brandsIndexMetadata } from '@/metadata/brand';
import { getBrandsIndexJsonLd } from '@/seo/brand';
import Script from 'next/script';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return brandsIndexMetadata(locale);
}

export default async function BrandsPage({ params }: Props) {
    const { locale } = await params;
    return (
        <>
            <Script id="jsonld-brands-index" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify(getBrandsIndexJsonLd(locale))}
            </Script>
            <BrandsClient />
        </>
    );
}
