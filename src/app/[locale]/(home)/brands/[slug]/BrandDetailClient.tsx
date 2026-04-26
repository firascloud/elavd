"use client";

import React, { useEffect, useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getBrandBySlug, Brand } from '@/services/brandService';
import { getProducts, Product } from '@/services/productService';
import { ProductCard } from '@/components/common/product-card';
import { AlertCircle, Building2, Package } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import Image from 'next/image';

interface BrandProductsPageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export default function BrandDetailClient({ params }: BrandProductsPageProps) {
    const { slug } = use(params);
    const t = useTranslations('dashboard');
    const commonT = useTranslations('common');
    const locale = useLocale();
    const isAr = locale === 'ar';
    
    const [brand, setBrand] = useState<Brand | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const brandData = await getBrandBySlug(slug);
            if (brandData) {
                setBrand(brandData);
                const productsData = await getProducts({ brandId: brandData.id, limit: 100 });
                setProducts(productsData);
            }
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-20 h-20 text-muted-foreground/20 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Brand Not Found</h1>
                <p className="text-muted-foreground mb-8">The brand you are looking for does not exist.</p>
            </div>
        );
    }

    const brandName = isAr ? brand.name_ar : brand.name_en;

    return (
        <div className="bg-[#fcf8f8] min-h-screen pb-20">
            <PageHeader 
                title={brandName || ''}
                subtitle={isAr ? `منتجات من ${brandName}` : `Products from ${brandName}`}
            />

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                {/* Brand Logo & Info Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-black/5 border border-[#eee1e1] flex flex-col md:flex-row items-center gap-8 mb-16">
                    <div className="w-32 h-32 relative flex items-center justify-center bg-white rounded-2xl border border-[#eee1e1] p-4 shrink-0 overflow-hidden shadow-inner">
                        {brand.image_url ? (
                            <Image 
                                src={brand.image_url} 
                                alt={brandName || ''} 
                                fill
                                className="object-contain p-2"
                            />
                        ) : (
                            <Building2 className="w-16 h-16 text-muted-foreground/20" />
                        )}
                    </div>
                    <div className="text-center md:text-start flex-1">
                        <h2 className="text-3xl font-black text-[#1a1a1b] mb-2">{brandName}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-[#fcf8f8] px-3 py-1.5 rounded-full border border-[#eee1e1]">
                                <Package className="w-4 h-4 text-primary" />
                                <span>{products.length} {isAr ? 'منتجات' : 'Products'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                {...product} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-[#eee1e1]">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#1a1a1b]">{isAr ? 'لا يوجد منتجات' : 'No Products Found'}</h3>
                        <p className="text-muted-foreground">{isAr ? 'لا توجد منتجات متاحة لهذه العلامة التجارية حالياً.' : 'There are no products available for this brand at the moment.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
