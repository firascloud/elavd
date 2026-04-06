'use client'

import React, { useTransition } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export default function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const getPages = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }
    return pages
  }

  if (totalPages <= 1 && totalItems <= 0) return null

  return (
    <div className="flex justify-center mt-20 mb-10">
      <div className="inline-flex items-center bg-white rounded-md shadow-md shadow-gray-100 hover:shadow-xl transition-all border border-gray-50 px-8 py-3 gap-2 md:gap-4 flex-wrap justify-center">
         
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-10 cursor-pointer flex items-center justify-center rounded-full text-gray-400 hover:text-[#f38d38] hover:bg-orange-50 transition-all disabled:opacity-20"
        >
          {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
 
        <div className="flex items-center gap-1">
          {totalPages > 7 ? (
             <>
               <PageButton page={1} current={currentPage} onClick={handlePageChange} />
               {currentPage > 3 && <span className="text-gray-300 px-1">...</span>}
               {getPages().filter(p => Math.abs(p - currentPage) <= 1 && p !== 1 && p !== totalPages).map(p => (
                 <PageButton key={p} page={p} current={currentPage} onClick={handlePageChange} />
               ))}
               {currentPage < totalPages - 2 && <span className="text-gray-300 px-1">...</span>}
               <PageButton page={totalPages} current={currentPage} onClick={handlePageChange} />
             </>
          ) : (
             getPages().map((page) => (
               <PageButton key={page} page={page} current={currentPage} onClick={handlePageChange} />
             ))
          )}
        </div>
 
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="size-10 cursor-pointer flex items-center justify-center rounded-full text-gray-400 hover:text-[#f38d38] hover:bg-orange-50 transition-all disabled:opacity-20"
        >
          {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
 
        <div className="h-6 w-px bg-gray-100 hidden md:block relative">
           {isPending && <Loader2 size={16} className="animate-spin text-[#f38d38] absolute -top-4 left-1/2 -translate-x-1/2" />}
        </div>
 
        <div className="hidden md:flex items-center gap-2 ltr:ml-2 rtl:mr-2">
           <div className="relative group">
              <button className="flex cursor-pointer   items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
                {searchParams.get('limit') || '12'} / {t('PerPage') || 'Page'}
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-full">
                {[9, 12, 18, 24].map(l => (
                   <button 
                    key={l}
                    onClick={() => {
                       const p = new URLSearchParams(searchParams.toString())
                       p.set('limit', l.toString())
                       p.set('page', '1')
                       router.push(`${pathname}?${p.toString()}`)
                    }}
                    className={`w-full cursor-pointer text-xs font-bold p-2.5 rounded-xl transition-all ${
                        searchParams.get('limit') === l.toString() 
                        ? 'bg-[#f38d38] text-white' 
                        : 'text-gray-600 hover:bg-orange-50 hover:text-[#f38d38]'
                    }`}
                   >
                     {l}
                   </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

const PageButton = ({ page, current, onClick }: { page: number, current: number, onClick: (p: number) => void }) => (
  <button
    onClick={() => onClick(page)}
    className={`size-8 flex items-center justify-center rounded-full text-sm font-black transition-all ${
      current === page 
        ? 'bg-[#f38d38] text-white shadow-lg shadow-orange-100 scale-110' 
        : 'text-gray-400 hover:text-[#f38d38] hover:bg-orange-50'
    }`}
  >
    {page}
  </button>
)
