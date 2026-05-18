"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { getProducts, type Product } from '@/services/home';
import { PackageX } from 'lucide-react';
import { ProductCard } from '@/components/common/product-card';
import { ProductCardSkeleton } from '@/components/common/ProductCardSkeleton';

export default function OurProducts() {
    const t = useTranslations('common');
    const locale = useLocale();

    const [activeTab, setActiveTab] = useState<'featured' | 'best_seller' | 'all'>('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setProducts([]);  
            setLoading(true);
            const data = await getProducts({
                is_featured: activeTab === 'featured',
                is_popular: activeTab === 'best_seller',
                limit: 4
            });
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [activeTab]);

    return (
        <section className="w-full py-16 px-3 md:px-0 bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto"> 
                <div className="flex items-center justify-start border-b border-border gap-8 mb-10 pb-1">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`text-md cursor-pointer font-bold pb-2 transition-all relative ${activeTab === 'all' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        {t('AllProducts')}
                        {activeTab === 'all' && (
                            <div className="absolute -bottom-[2px] right-0 left-0 h-[3px] bg-foreground" />
                        )}
                    </button>  
                    <button
                        onClick={() => setActiveTab('featured')}
                        className={`text-md cursor-pointer font-bold pb-2 transition-all relative ${activeTab === 'featured' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        {t('FeaturedProducts')}
                        {activeTab === 'featured' && (
                            <div className="absolute -bottom-[2px] right-0 left-0 h-[3px] bg-foreground" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('best_seller')}
                        className={`text-md cursor-pointer font-bold pb-2 transition-all relative ${activeTab === 'best_seller' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        {t('BestSellers')}
                        {activeTab === 'best_seller' && (
                            <div className="absolute -bottom-[2px] right-0 left-0 h-[3px] bg-foreground" />
                        )}
                    </button>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <ProductCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((prod) => (
                            <ProductCard key={prod.id} {...prod} is_hot={prod.is_featured} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                        <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                            <PackageX className="size-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="font-cairo font-bold text-xl text-foreground mb-2">
                            {t('NoProductsFound')}
                        </h3>   
                        <p className="text-muted-foreground text-sm max-w-xs">
                            {t('NoProductsDescription')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}



