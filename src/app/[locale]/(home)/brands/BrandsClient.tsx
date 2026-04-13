"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getBrands, Brand } from '@/services/brandService';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';

export default function BrandsClient() {
    const t = useTranslations('dashboard');
    const commonT = useTranslations('common');
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrands(500); // High limit to get all
            setBrands(data);
            setLoading(false);
        };
        fetchBrands();
    }, []);

    // Group brands by index
    const groupedBrands: Record<string, Brand[]> = brands.reduce((acc, brand) => {
        const index = (isAr ? brand.brand_index_ar : brand.brand_index_en) || '#';
        if (!acc[index]) acc[index] = [];
        acc[index].push(brand);
        return acc;
    }, {} as Record<string, Brand[]>);

    // Sort index keys
    const sortedIndices = Object.keys(groupedBrands).sort((a, b) => a.localeCompare(b, isAr ? 'ar' : 'en'));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcf8f8] min-h-screen pb-20">
            <PageHeader 
                title={t('Brands')}
                subtitle={t('BrandsDescription')}
            />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="space-y-16 mt-12">
                    {sortedIndices.map((index) => (
                                <section key={index} className="scroll-mt-20">
                                    <div className="flex items-center gap-6 mb-8">
                                        <span className="text-4xl font-black text-primary drop-shadow-md">{index}</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-[#eee1e1] to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {groupedBrands[index].sort((a, b) => (isAr ? (a.name_ar || '') : (a.name_en || '')).localeCompare(isAr ? (b.name_ar || '') : (b.name_en || ''))).map((brand) => (
                                            <Link
                                                key={brand.id}
                                                href={`/store/${isAr ? brand.slug_ar : brand.slug_en}`}
                                                className="group bg-white rounded-3xl p-6 border border-[#eee1e1] hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 flex flex-col items-center gap-4 text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                            >
                                        <div className="w-24 h-24 relative flex items-center justify-center p-2 rounded-2xl bg-white transition-transform duration-500 group-hover:scale-105">
                                            {brand.image_url ? (
                                                <Image 
                                                    src={brand.image_url} 
                                                    alt={isAr ? brand.name_ar || '' : brand.name_en || ''} 
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <Icon icon="mdi:domain" className="w-12 h-12 text-muted-foreground/30" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-sm text-[#1a1a1b] group-hover:text-primary transition-colors line-clamp-1">
                                            {isAr ? brand.name_ar : brand.name_en}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {brands.length === 0 && (
                   <div className="text-center py-40">
                       <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                           <Icon icon="mdi:alert-circle-outline" className="w-10 h-10 text-muted-foreground/30" />
                       </div>
                       <p className="text-muted-foreground font-medium">{t('NoBrandsFound')}</p>
                   </div>
                )}
            </div>
        </div>
    );
}
