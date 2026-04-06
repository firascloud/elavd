'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Category, Product } from '@/services/home'
import Image from 'next/image'
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react'

interface CategorySidebarProps {
  categories: Category[]
  featuredProducts: Product[]
  activeSlug: string
}

export default function CategorySidebar({ categories, featuredProducts, activeSlug }: CategorySidebarProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const isRtl = locale === 'ar'

  return (
    <aside className="w-full space-y-8"> 
      <div className="bg-white border border-gray-100 rounded-md max-h-[400px] overflow-hidden shadow-sm">
        <div className="bg-[#f38d38] px-6 py-4">
          <h3 className="text-white font-bold text-lg font-cairo">
            {t('OurCategories')}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((category) => {
            const name = locale === 'ar' ? category.name_ar : category.name_en
            const slug = (locale === 'ar' ? category.slug_ar : category.slug_en) || category.id
            const isActive = activeSlug === slug || activeSlug === category.slug_en || activeSlug === category.slug_ar

            return (
              <Link
                key={category.id}
                href={`/product-category/${slug}`}
                className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 group ${
                  isActive ? 'bg-orange-50 text-[#f38d38]' : 'text-gray-600'
                }`}
              >
                <span className={`font-medium font-cairo ${isActive ? 'font-bold' : ''}`}>
                  {name}
                </span>
                {isRtl ? (
                  <ChevronLeft size={16} className={isActive ? 'text-[#f38d38]' : 'text-gray-300 group-hover:text-[#f38d38]'} />
                ) : (
                  <ChevronRight size={16} className={isActive ? 'text-[#f38d38]' : 'text-gray-300 group-hover:text-[#f38d38]'} />
                )}
              </Link>
            )
          })}
        </div>
      </div>
 
      <div className="bg-white border border-gray-100 rounded-md min-h-[400px] overflow-hidden shadow-sm">
        <div className="bg-[#f38d38] px-6 py-4">
          <h3 className="text-white font-bold text-lg font-cairo">
            {t('FeaturedProducts')}
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {featuredProducts.map((product) => {
            const name = locale === 'ar' ? product.name_ar : product.name_en
            const slug = (locale === 'ar' ? product.slug_ar : product.slug_en) || product.id

            return (
              <Link
                key={product.id}
                href={`/product/${slug}`}
                className="flex items-center gap-4 group"
              >
                <div className="relative size-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {product.main_image ? (
                    <Image
                      src={product.main_image}
                      alt={name || ''}
                      fill
                      className="object-contain p-2 transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <Layers size={20} className="text-gray-300 m-auto mt-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 font-cairo line-clamp-2 group-hover:text-[#f38d38] transition-colors leading-snug">
                    {name}
                  </h4>
                  {product.price && (
                    <p className="text-[#f38d38] font-bold mt-1 text-sm">
                      {product.price} {t('Currency')}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
