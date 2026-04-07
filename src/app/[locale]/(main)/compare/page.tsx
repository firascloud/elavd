"use client"

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { Repeat, X, Check, ShoppingCart, Heart, Info, Globe } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import PageHeader from '@/components/common/page-header'
import { cn } from '@/lib/utils'

export default function ComparePage() {
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
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <PageHeader 
        title={t('Compare')} 
        subtitle={countText} 
        icon={<Repeat className="size-6" />}
      />

      <div className="container mx-auto px-4 mt-10 relative z-20">
        {compareItems.length > 0 ? (
          <div className="bg-white rounded-md p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-x-auto">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 font-cairo">
                {locale === 'ar' ? 'جدول المقارنة' : 'Comparison Table'}
              </h2>
              <button 
                onClick={clearCompare}
                className="text-sm font-bold text-[#d32f2f] hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-red-100"
              >
                <X size={16} />
                {t('ClearAll')}
              </button>
            </div>

            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[200px] p-6 text-left border-b border-gray-100"></th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="p-6 border-b border-gray-100 relative group min-w-[250px]">
                      <button 
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-4 right-4 p-2.5 bg-white text-gray-400 rounded-2xl shadow-lg border border-gray-100 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10"
                        title={t('Remove')}
                      >
                        <X size={16} />
                      </button>
                      <div className="relative aspect-square w-40 mx-auto mb-6 transform transition-all duration-500 group-hover:scale-105">
                        <div className="absolute inset-0 bg-[#f38d38]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image 
                          src={item.main_image || ''} 
                          alt={item.name_ar || 'Product'} 
                          fill 
                          className="object-contain relative z-10" 
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 h-14 font-cairo text-center px-4 leading-tight">
                        {locale === 'ar' ? item.name_ar : item.name_en}
                      </h3>
                      
                      <div className="mt-4 flex flex-col gap-2 px-4">
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#f38d38] transition-all"
                        >
                          <ShoppingCart size={16} />
                          {t('AddToCart')}
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className={cn(
                            "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all",
                            isInWishlist(item.id) 
                              ? "bg-red-50 text-red-600 border-red-100" 
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#f38d38] hover:text-[#f38d38]"
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
              <tbody className="text-sm text-gray-600">
             
 
                {compareItems.some(item => item.country_of_origin) && (
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 font-bold text-gray-900 border-b border-gray-50 flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                         <Globe size={16} />
                      </div>
                      {locale === 'ar' ? 'بلد المنشأ' : 'Origin'}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-6 border-b border-gray-50 text-center font-medium">
                        {item.country_of_origin || (locale === 'ar' ? 'غير محدد' : 'Not Specified')}
                      </td>
                    ))}
                  </tr>
                )}
 
                <tr className="group hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-900 border-b border-gray-50 flex items-center gap-2">
                    <div className="p-2 bg-orange-50 text-[#f38d38] rounded-lg">
                       <Repeat size={16} />
                    </div>
                    {locale === 'ar' ? 'الوصف المختصر' : 'Short Description'}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 border-b border-gray-50 text-center italic text-gray-500 leading-relaxed font-cairo">
                      {locale === 'ar' ? item.short_desc_ar : item.short_desc_en}
                    </td>
                  ))}
                </tr>
 
                <tr className="group hover:bg-gray-50/50 transition-colors">
                   <td className="p-6 font-bold text-gray-900 border-b border-gray-50 flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                       <Check size={16} />
                    </div>
                    {locale === 'ar' ? 'التوفر' : 'Availability'}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 border-b border-gray-50">
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
          <div className="p-16 lg:p-24  text-center max-w-4xl mx-auto bg-white rounded-md shadow-sm border border-gray-100">
            <div className="size-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-12 transition-transform hover:rotate-0">
              <Repeat size={44} className="text-gray-200" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 font-cairo">
              {t('CompareEmpty')}
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto">
              {t('CompareDesc')}
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-10 py-4 bg-[#f38d38] text-white font-bold rounded-2xl hover:bg-[#e67e22] transition-all shadow-xl shadow-orange-200"
            >
              {t('BrowseCategories')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
