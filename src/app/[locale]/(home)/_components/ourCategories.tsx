"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Layers } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getCategories, getFeaturedProducts, type Category, type Product } from '@/services/home';
import { Link } from '@/i18n/routing';

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

    const [emblaRef] = useEmblaCarousel(
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

    const CategoryCard = ({ cat, idx, isGrid = false }: { cat: Category; idx: number; isGrid?: boolean }) => (
        <div key={cat.id ?? idx} className={isGrid ? "w-full" : "min-w-[100%] sm:min-w-[48%] md:min-w-[30%] flex-shrink-0"}>
            <article className="group h-full border border-gray-100 bg-white rounded-2xl sm:rounded-3xl transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 p-4 sm:p-6 flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[100px] sm:max-w-[160px] lg:max-w-[180px] bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-105">
                    {loading ? (
                        <div className="w-full h-full animate-pulse bg-gray-100" />
                    ) : cat.image_url ? (
                        <div className="relative w-[75%] h-[75%]">
                            <Image
                                src={cat.image_url}
                                alt={(locale === 'ar' ? cat.name_ar : cat.name_en) || 'Category'}
                                fill
                                sizes="(max-width: 640px) 80px, (max-width: 1024px) 140px, 200px"
                                className="object-contain transition-all duration-700 group-hover:scale-110"
                            />
                        </div>
                    ) : (
                        <Layers className="h-10 w-10 text-gray-200" />
                    )}
                </div>

                <div className="flex flex-col flex-1 w-full text-center">
                    <Link href={`/product-category/${cat.slug_en}`}>
                        <h3 className="font-black line-clamp-1 text-[#111] text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-snug group-hover:text-primary transition-colors">
                            {loading ? (
                                <span className="block h-4 w-20 bg-gray-100 rounded-full animate-pulse mx-auto" />
                            ) : (
                                (locale === 'ar' ? cat.name_ar : cat.name_en) || '—'
                            )}
                        </h3>
                    </Link>
                    
                    <div className="mt-auto">
                        <Link href={`/product-category/${cat.slug_en}`} className="inline-block w-full">
                            <button
                                type="button"
                                className="w-full py-2 sm:py-3 px-3 sm:px-5 cursor-pointer rounded-xl sm:rounded-2xl bg-[#111] text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-md shadow-black/5 active:scale-95"
                            >
                                {t('ViewMore')}
                            </button>
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );

    const displayCategories = loading
        ? Array.from({ length: 6 }).map((_, i) => ({ id: String(i) } as any))
        : categories;

    return (
        <section
            className="w-full py-12 bg-white"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 md:order-2 order-1 mt-2">
                        <div className="mb-10 flex flex-col items-start border-b border-gray-100 pb-2 relative">
                            <h2 className=" text-xl sm:text-2xl font-extrabold text-[#1a1a1a]">
                                {t('OurCategories')}
                            </h2>
                            <div className="absolute -bottom-[2px]  ltr:left-0 rtl:right-0 w-24 h-[4px] bg-primary" />
                        </div>

                        <div className="relative">
                            {/* Grid for small screens */}
                            <div className="grid grid-cols-2 gap-4 sm:hidden">
                                {displayCategories.map((cat, idx) => (
                                    <CategoryCard key={cat.id ?? idx} cat={cat} idx={idx} isGrid={true} />
                                ))}
                            </div>

                            {/* Carousel for large screens */}
                            <div className="hidden sm:block">
                                <div ref={emblaRef} className="overflow-hidden">
                                    <div className="flex gap-6">
                                        {displayCategories.map((cat, idx) => (
                                            <CategoryCard key={cat.id ?? idx} cat={cat} idx={idx} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-1 md:order-1 order-2">
                        <div className="border border-gray-200 overflow-hidden">
                            <div className="bg-primary/90 text-white px-6 py-3.5 font-extrabold text-lg text-center">
                                {t('FeaturedProducts')}
                            </div>
                            <div className="divide-y divide-gray-100 min-h-[385px]">
                                {(loading ? Array.from({ length: 4 }) : featuredProducts).map((prod: any, i) => (
                                    <Link href={`/product/${prod?.slug_en}`} key={prod?.id ?? i} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
                                        <div className="relative h-16 w-16 bg-white overflow-hidden border border-gray-100 flex-shrink-0 group-hover:border-primary/20 transition-colors">
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
                                                    className="object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </div>
                                        <div className="text-start flex-1 min-w-0">
                                            <div className=" font-bold text-[#1a1a1a]  text-sm truncate leading-tight group-hover:text-primary transition-colors">
                                                {loading ? <div className="h-4 w-32 bg-gray-100  rounded  animate-pulse mx-auto" /> : (locale === 'ar' ? prod.name_ar : prod.name_en)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 uppercase ltr:tracking-wider">
                                                {loading ? <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mx-auto" /> : ((locale === 'ar' ? prod.slug_ar : prod.slug_en)?.substring(0, 10).toUpperCase() || 'PROD')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
