"use client"

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { Repeat, X, Check, Layers } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import PageHeader from '@/components/common/page-header'

export default function ComparePage() {
  const t = useTranslations('common')
  const locale = useLocale();
  const { compareItems, removeFromCompare, clearCompare } = useAppStore()

  const countText = locale === 'ar'
    ? `لديك ${compareItems.length} منتجات في المقارنة`
    : `You have ${compareItems.length} items in comparison`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader 
        title={t('Compare')} 
        subtitle={countText}
        icon={<Repeat size={32} />}
      />
      <div className="container mx-auto px-4 mt-10 relative z-20">
        {compareItems.length > 0 ? (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-x-auto">
            <div className="flex items-center justify-end mb-6">
              <button 
                onClick={clearCompare}
                className="text-sm font-bold text-[#d32f2f] hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
                {t('ClearAll')}
              </button>
            </div>
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 p-4 text-left border-b border-gray-50"></th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="w-1/4 p-6 border-b border-gray-50 relative group min-w-[200px]">
                      <button 
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                      <div className="relative size-32 mx-auto mb-6 transform transition-transform group-hover:scale-110">
                        <Image src={item.main_image || ''} alt={item.name_ar || 'Product'} fill className="object-contain" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 h-12 font-cairo text-center">
                        {locale === 'ar' ? item.name_ar : item.name_en}
                      </h3>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr>
                  <td className="p-6 font-bold text-gray-900 bg-gray-50/50 border-b border-gray-50 rounded-tr-xl">
                    {locale === 'ar' ? 'الوصف القصير' : 'Short Description'}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 border-b border-gray-50 text-center italic leading-relaxed">
                      {locale === 'ar' ? item.short_desc_ar : item.short_desc_en}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 font-bold text-gray-900 bg-gray-50/50 border-b border-gray-100 rounded-br-xl">
                    {locale === 'ar' ? 'التوفر' : 'Availability'}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 border-b border-gray-50">
                      <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                        <Check size={16} />
                        {locale === 'ar' ? 'متوفر' : 'In Stock'}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 lg:p-24 text-center max-w-4xl mx-auto">
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
