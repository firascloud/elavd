"use client";

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { Repeat, X, Check, ShoppingCart, Heart, Globe } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import PageHeader from '@/components/common/page-header'
import { cn } from '@/lib/utils'

export default function CompareClient() {
    const t = useTranslations('common')
    const locale = useLocale();
    const {
        compareItems,
        removeFromCompare,
        clearCompare,
        addToCart,
        toggleWishlist,
        isInWishlist
    } = useAppStore()

    const countText = locale === 'ar'
        ? `لديك ${compareItems.length} منتجات في المقارنة`
        : `You have ${compareItems.length} items in comparison`;

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <PageHeader
                title={t('Compare')}
                subtitle={countText}
                icon={<Repeat className="size-6" />}
            />

            <div className="container mx-auto px-4 mt-10 relative z-20">
                {compareItems.length > 0 ? (
                    <div className="bg-background rounded-md p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-border overflow-x-auto">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground font-cairo">
                                {locale === 'ar' ? 'جدول المقارنة' : 'Comparison Table'}
                            </h2>
                            <button
                                onClick={clearCompare}
                                className="text-sm font-bold text-destructive hover:bg-destructive/10 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-destructive/20"
                            >
                                <X size={16} />
                                {t('ClearAll')}
                            </button>
                        </div>

                        <table className="w-full min-w-[900px] border-collapse" role="table">
                            <thead>
                                <tr role="row">
                                    <th scope="col" className="w-[200px] p-6 text-left border-b border-border">
                                        <span className="sr-only">{t('Features')}</span>
                                    </th>
                                    {compareItems.map((item) => (
                                        <th key={item.id} scope="col" className="p-6 border-b border-border relative group min-w-[250px]">
                                            <button
                                                onClick={() => removeFromCompare(item.id)}
                                                className="absolute top-4 right-4 p-2.5 bg-background text-muted-foreground rounded-2xl shadow-lg border border-border hover:text-destructive transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10"
                                                aria-label={`${t('Remove')} ${locale === 'ar' ? item.name_ar : item.name_en}`}
                                                title={t('Remove')}
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="relative aspect-square w-40 mx-auto mb-6 transform transition-all duration-500 group-hover:scale-105">
                                                <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Image
                                                    src={item.main_image || ''}
                                                    alt={item.name_ar || 'Product'}
                                                    fill
                                                    className="object-contain relative z-10"
                                                />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 h-14 font-cairo text-center px-4 leading-tight">
                                                {locale === 'ar' ? item.name_ar : item.name_en}
                                            </h3>

                                            <div className="mt-4 flex flex-col gap-2 px-4">
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="w-full py-3 bg-foreground text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all"
                                                >
                                                    <ShoppingCart size={16} />
                                                    {t('AddToCart')}
                                                </button>
                                                <button
                                                    onClick={() => toggleWishlist(item)}
                                                    className={cn(
                                                        "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all",
                                                        isInWishlist(item.id)
                                                            ? "bg-destructive/5 text-destructive border-destructive/10"
                                                            : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                                                    )}
                                                >
                                                    <Heart size={16} className={isInWishlist(item.id) ? "fill-current" : ""} />
                                                    {isInWishlist(item.id) ? t('InWishlist') : t('AddToWishlist')}
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm text-muted-foreground">
                                {compareItems.some(item => item.country_of_origin) && (
                                    <tr role="row" className="group hover:bg-muted/30 transition-colors">
                                        <th scope="row" className="p-6 font-bold text-foreground border-b border-border flex items-center gap-2 text-start">
                                            <div className="p-2 bg-secondary/10 text-secondary rounded-lg" aria-hidden="true">
                                                <Globe size={16} />
                                            </div>
                                            {locale === 'ar' ? 'بلد المنشأ' : 'Origin'}
                                        </th>
                                        {compareItems.map((item) => (
                                            <td key={item.id} className="p-6 border-b border-border text-center font-medium">
                                                {item.country_of_origin || (locale === 'ar' ? 'غير محدد' : 'Not Specified')}
                                            </td>
                                        ))}
                                    </tr>
                                )}

                                <tr role="row" className="group hover:bg-muted/30 transition-colors">
                                    <th scope="row" className="p-6 font-bold text-foreground border-b border-border flex items-center gap-2 text-start">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg" aria-hidden="true">
                                            <Repeat size={16} />
                                        </div>
                                        {locale === 'ar' ? 'الوصف المختصر' : 'Short Description'}
                                    </th>
                                    {compareItems.map((item) => (
                                        <td key={item.id} className="p-6 border-b border-border text-center italic text-muted-foreground leading-relaxed font-cairo">
                                            {locale === 'ar' ? item.short_desc_ar : item.short_desc_en}
                                        </td>
                                    ))}
                                </tr>

                                <tr role="row" className="group hover:bg-muted/30 transition-colors">
                                    <th scope="row" className="p-6 font-bold text-foreground border-b border-border flex items-center gap-2 text-start">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg" aria-hidden="true">
                                            <Check size={16} />
                                        </div>
                                        {locale === 'ar' ? 'التوفر' : 'Availability'}
                                    </th>
                                    {compareItems.map((item) => (
                                        <td key={item.id} className="p-6 border-b border-border">
                                            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                                                <Check size={16} />
                                                {locale === 'ar' ? 'متوفر بالمخزن' : 'In Stock'}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 lg:p-24  text-center max-w-4xl mx-auto bg-background rounded-md shadow-sm border border-border">
                        <div className="size-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-12 transition-transform hover:rotate-0">
                            <Repeat size={44} className="text-muted-foreground/30" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-foreground mb-4 font-cairo">
                            {t('CompareEmpty')}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">
                            {t('CompareDesc')}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                        >
                            {t('BrowseCategories')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

