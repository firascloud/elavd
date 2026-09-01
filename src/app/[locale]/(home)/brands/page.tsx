import React from 'react';
import BrandsClient from './BrandsClient';
import { Metadata } from 'next';
import { brandsIndexMetadata } from '@/metadata/brand';
import { getBrandsIndexJsonLd } from '@/seo/brand';

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
            <script
                id="jsonld-brands-index"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getBrandsIndexJsonLd(locale)) }}
            />
            <BrandsClient />
        </>
    );
}
