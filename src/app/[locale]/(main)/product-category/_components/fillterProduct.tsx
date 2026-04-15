'use client'

import React, { useTransition } from 'react'
import { LayoutGrid, List, Grid2X2, Grid3X3, ChevronDown, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

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
    <div className="w-full bg-background border-b border-border py-4 mb-8 relative z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">

          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium font-cairo">
            {isPending && <Loader2 size={16} className="animate-spin text-primary" />}
            <span className="text-muted-foreground">
              {t("Showing")} <span className="text-primary font-bold">{totalItems}</span> {t("Products")} {t("in")} <span className="text-foreground">{categoryName}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 sm:gap-8 lg:gap-10 w-full lg:w-auto">

            {/* Show Count */}
            <div className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium">
              <span className="font-cairo uppercase ltr:tracking-wider text-[11px] text-muted-foreground">{t('Show')} :</span>
              <div className="flex items-center gap-2.5">
                {showOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateParams('limit', opt)}
                    className={`hover:text-primary cursor-pointer transition-colors ${searchParams.get('limit') === opt.toString() ? 'text-primary font-bold scale-110' : 'text-muted-foreground'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* View Icons */}
            <div className="flex items-center gap-2 text-muted-foreground border-x border-border px-5 sm:px-8 hidden sm:flex">
              <button
                onClick={() => updateParams('view', 'grid-4')}
                className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-4' || currentView === 'grid' ? 'text-primary bg-primary/5 rounded-lg' : 'hover:text-foreground'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => updateParams('view', 'grid-3')}
                className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-3' ? 'text-primary bg-primary/5 rounded-lg' : 'hover:text-foreground'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => updateParams('view', 'grid-2')}
                className={`p-1.5 cursor-pointer transition-all ${currentView === 'grid-2' ? 'text-primary bg-primary/5 rounded-lg' : 'hover:text-foreground'}`}
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => updateParams('view', 'list')}
                className={`p-1.5 cursor-pointer transition-all ${currentView === 'list' ? 'text-primary bg-primary/5 rounded-lg' : 'hover:text-foreground'}`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="relative group z-[999]">
              {(() => {
                const currentSort = searchParams.get('sort') || 'default'
                const options = [
                  { val: 'default', key: 'DefaultSorting' },
                  { val: 'newest', key: 'Newest' },
                  { val: 'price-low', key: 'PriceLowHigh' },
                  { val: 'price-high', key: 'PriceHighLow' }
                ]
                const activeOption = options.find(o => o.val === currentSort) || options[0]

                return (
                  <>
                    <button className="flex items-center cursor-pointer shadow-none gap-3 text-[13px] font-semibold text-foreground font-cairo border-b border-transparent hover:border-border pb-1 px-1 transition-all">
                      <ChevronDown size={14} className="text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
                      {t(activeOption.key)}
                    </button>
                    <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 bg-background shadow-2xl rounded-xl border border-border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px]">
                      {options.map((sort) => (
                        <button
                          key={sort.val}
                          onClick={() => updateParams('sort', sort.val)}
                          className={`w-full cursor-pointer text-start px-4 py-2 hover:bg-muted/30 rounded-lg text-xs font-semibold font-cairo transition-colors ${currentSort === sort.val ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                          {t(sort.key)}
                        </button>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}