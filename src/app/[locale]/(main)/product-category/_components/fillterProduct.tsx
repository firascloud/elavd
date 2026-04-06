'use client'

import React, { useTransition } from 'react'
import { LayoutGrid, List, Grid2X2, Grid3X3, ChevronDown,   Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface FilterProductProps {
  categoryName: string
  totalItems: number
  currentView: string
}

export default function FilterProduct({ 
  categoryName, 
  totalItems, 
  currentView
}: FilterProductProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const showOptions = [9, 12, 18, 24]

  const updateParams = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value.toString()) 
    if (key !== 'page') params.set('page', '1')
    
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="w-full bg-[#fcfcfc] border-b border-gray-100 py-4 mb-8 relative z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
          
          <div className="flex items-center gap-3 text-sm text-gray-400 font-medium font-cairo">
            {isPending && <Loader2 size={16} className="animate-spin text-[#f38d38]" />}
            <span className="text-gray-600">
               {t("Showing")} <span className="text-[#f38d38] font-bold">{totalItems}</span> {t("Products")} {t("in")} <span className="text-[#1a1a1a]">{categoryName}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 sm:gap-8 lg:gap-10 w-full lg:w-auto">
             
            {/* Show Count */}
            <div className="flex items-center gap-3 text-[13px] text-gray-400 font-medium">
              <span className="font-cairo uppercase tracking-wider text-[11px] text-gray-400">{t('Show')} :</span>
              <div className="flex items-center gap-2.5">
                {showOptions.map((opt) => (
                   <button
                    key={opt}
                    onClick={() => updateParams('limit', opt)}
                    className={`hover:text-[#f38d38] cursor-pointer transition-colors ${
                      searchParams.get('limit') === opt.toString() ? 'text-[#f38d38] font-bold scale-110' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
 
            {/* View Icons */}
            <div className="flex items-center gap-2 text-gray-300 border-x border-gray-100 px-5 sm:px-8 hidden sm:flex">
               <button 
                  onClick={() => updateParams('view', 'grid-4')}
                  className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-4' || currentView === 'grid' ? 'text-[#f38d38] bg-orange-50 rounded-lg' : 'hover:text-gray-900'}`}
               >
                  <Grid3X3 size={18} />
               </button>
                <button 
                  onClick={() => updateParams('view', 'grid-3')}
                  className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-3' ? 'text-[#f38d38] bg-orange-50 rounded-lg' : 'hover:text-gray-900'}`}
               >
                  <LayoutGrid size={18} />
               </button>
               <button 
                  onClick={() => updateParams('view', 'grid-2')}
                  className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-2' ? 'text-[#f38d38] bg-orange-50 rounded-lg' : 'hover:text-gray-900'}`}
               >
                  <Grid2X2 size={18} />
               </button> 
               <button 
                  onClick={() => updateParams('view', 'list')}
                  className={`p-1.5 cursor-pointer transition-all ${currentView === 'list' ? 'text-[#f38d38] bg-orange-50 rounded-lg' : 'hover:text-gray-900'}`}
               >
                  <List size={18} />
               </button>
            </div>
 
            {/* Sorting Dropdown */}
            <div className="relative group z-[999]">
               <button className="flex items-center cursor-pointer shadow-none gap-3 text-[13px] font-bold text-[#1a1a1a] font-cairo border-b border-transparent hover:border-gray-200 pb-1 px-1 transition-all">
                  <ChevronDown size={14} className="text-gray-400 group-hover:translate-y-0.5 transition-transform" />
                  {t('DefaultSorting')}
               </button>
               <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 bg-white shadow-2xl rounded-xl border border-gray-50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px]">
                  {[
                    { val: 'default', key: 'DefaultSorting' },
                    { val: 'newest', key: 'Newest' },
                    { val: 'price-low', key: 'PriceLowHigh' },
                    { val: 'price-high', key: 'PriceHighLow' }
                  ].map((sort) => (
                    <button 
                       key={sort.val}
                       onClick={() => updateParams('sort', sort.val)}
                       className="w-full cursor-pointer text-start px-4 py-2 hover:bg-gray-50 rounded-lg text-xs font-semibold font-cairo text-gray-600 hover:text-[#f38d38] transition-colors"
                    >
                       {t(sort.key)}
                    </button>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}