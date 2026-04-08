"use client";

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { ProductCard } from '@/components/common/product-card'
import { Heart } from 'lucide-react'
import { Link } from '@/i18n/routing'
import PageHeader from '@/components/common/page-header'
import Script from 'next/script'
import { getFavoriteJsonLd } from '@/seo/favorite'

export default function FavoriteClient() {
  const t = useTranslations('common')
  const locale = useLocale();
  const { wishlist } = useAppStore()

  const countText = locale === 'ar'
    ? `لديك ${wishlist.length} منتجات في قائمتك`
    : `You have ${wishlist.length} items in your wishlist`;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Script id="jsonld-favorite" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(getFavoriteJsonLd(locale))}
      </Script>
      <PageHeader
        title={t('Wishlist')}
        subtitle={countText}
        icon={<Heart size={32} fill="currentColor" />}
      />

      <div className="container mx-auto px-4 mt-10 relative z-20">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="p-16 lg:p-24 text-center max-w-4xl mx-auto">
            <div className="size-24 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-6 transition-transform hover:rotate-0">
              <Heart size={44} className="text-muted-foreground/20" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4 font-cairo">
              {t('WishlistEmpty')}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto leading-relaxed">
              {t('WishlistDesc')}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95"
            >
              {t('BrowseCategories')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

