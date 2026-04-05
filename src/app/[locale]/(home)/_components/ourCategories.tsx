"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Layers } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getCategories, getFeaturedProducts, type Category, type Product } from '@/services/home';

export default function ourCategories() {
    const t = useTranslations('common');
    const locale = useLocale();

    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const emblaPlugins = useMemo(
        () => [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })],
        []
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: 'start',
            dragFree: true,
            direction: locale === 'ar' ? 'rtl' : 'ltr',
        },
        emblaPlugins
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getCategories(16),
                    getFeaturedProducts(4)
                ]);
                setCategories(categoriesData);
                setFeaturedProducts(productsData);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section
            className="w-full py-12 bg-white"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> 
                    <div className="lg:col-span-3 order-2 mt-2">
                        <div className="mb-10 flex flex-col items-start border-b border-gray-100 pb-2 relative">
                            <h2 className=" text-xl sm:text-2xl font-extrabold text-[#1a1a1a]">
                                {t('OurCategories')}
                            </h2>
                            <div className="absolute -bottom-[2px]  ltr:left-0 rtl:right-0 w-24 h-[4px] bg-[#555]" />
                        </div>

                        <div className="relative">
                            <div ref={emblaRef} className="overflow-hidden">
                                <div className="flex gap-6">
                                    {(loading
                                        ? Array.from({ length: 3 }).map((_, i) => ({ id: String(i) } as any))
                                        : categories
                                    ).map((cat: Category, idx) => (
                                        <div key={cat.id ?? idx} className="min-w-[100%] rounded-md sm:min-w-[48%] md:min-w-[30%] flex-shrink-0">
                                            <article className="h-full border border-gray-200  bg-white transition-all hover:shadow-md p-6 flex flex-col items-center">
                                              
                                                <div className="relative size-48 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden mb-6 bg-white shrink-0">
                                                    {loading ? (
                                                        <div className="min-h-[385px] w-full animate-pulse bg-gray-100 rounded-full" />
                                                    ) : cat.image_url ? (
                                                        <div className="relative size-40">
                                                            <Image
                                                                src={cat.image_url}
                                                                alt={(locale === 'ar' ? cat.name_ar : cat.name_en) || 'Category'}
                                                                fill
                                                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Layers className="h-10 w-10 text-gray-300" />
                                                    )}
                                                </div>

                                              

                                                <h3 className="text-center  font-extrabold line-clamp-1 text-[#1a1a1a] text-lg mb-6 leading-tight">
                                                    {loading ? (
                                                        <span className="block h-4 w-32 bg-gray-100 rounded animate-pulse mx-auto" />
                                                    ) : (
                                                        (locale === 'ar' ? cat.name_ar : cat.name_en) || '—'
                                                    )}
                                                </h3>
                                                 <button
                                                    type="button"
                                                    className="w-full py-2.5 cursor-pointer rounded-md bg-[#fbb034] text-white font-bold text-sm hover:bg-[#e9a12c] transition-colors shadow-sm"
                                                >
                                                    {t('ViewMore')}
                                                </button>
                                            </article>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className="lg:col-span-1 order-1">
                        <div className="border border-gray-200 overflow-hidden">
                            <div className="bg-[#fbb034] text-white px-6 py-3.5  font-extrabold text-lg text-center">
                                {t('FeaturedProducts')}
                            </div>
                            <div className="divide-y divide-gray-100 min-h-[385px]">
                                {(loading ? Array.from({ length: 4 }) : featuredProducts).map((prod: any, i) => (
                                    <div key={prod?.id ?? i} className="flex items-center   gap-4 p-5 hover:bg-gray-50 transition-colors">
                                                                              <div className="relative h-16 w-16 bg-white overflow-hidden border border-gray-100 flex-shrink-0">
                                            {loading || !prod?.image_url ? (
                                                <div className="h-full w-full grid place-items-center bg-gray-50">
                                                    <Layers className="h-6 w-6 text-gray-300" />
                                                </div>
                                            ) : (
                                                <Image
                                                    src={prod.image_url}
                                                    alt={(locale === 'ar' ? prod.name_ar : prod.name_en) || 'Product'}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </div>
                                        <div className="text-start flex-1 min-w-0">
                                            <div className=" font-bold text-[#1a1a1a]  text-sm truncate leading-tight">
                                                {loading ? <div className="h-4 w-32 bg-gray-100  rounded  animate-pulse mx-auto" /> : (locale === 'ar' ? prod.name_ar : prod.name_en)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                                                {loading ? <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mx-auto" /> : (prod.slug_en?.substring(0, 10).toUpperCase() || 'PROD')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
