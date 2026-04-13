import React from 'react';
import BrandDetailClient from './BrandDetailClient';
import { getBrandBySlug } from '@/services/brandService';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);

    if (!brand) {
        return {
            title: 'Brand Not Found',
        };
    }

    return {
        title: `${brand.name_en} | Brands | Elavd`,
        description: `Explore premium products from ${brand.name_en}.`,
    };
}

export default function BrandPage({ params }: Props) {
    return <BrandDetailClient params={params} />;
}
