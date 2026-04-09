'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

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

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${pathname}?${params.toString()}`
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
    <nav className="flex justify-center mt-20 mb-10" aria-label="Pagination">
      <div className="inline-flex items-center bg-background rounded-md shadow-md shadow-muted hover:shadow-xl transition-all border border-border px-8 py-3 gap-2 md:gap-4 flex-wrap justify-center font-sans">

        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            aria-label={t('Previous') || 'Previous page'}
            className="size-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Link>
        ) : (
          <div className="size-10 flex items-center justify-center rounded-full text-muted-foreground opacity-20 transition-all cursor-not-allowed">
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </div>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {totalPages > 7 ? (
            <>
              <PageLink page={1} current={currentPage} url={getPageUrl(1)} />
              {currentPage > 3 && <span className="text-gray-300 px-1" aria-hidden="true">...</span>}
              {getPages().filter(p => Math.abs(p - currentPage) <= 1 && p !== 1 && p !== totalPages).map(p => (
                <PageLink key={p} page={p} current={currentPage} url={getPageUrl(p)} />
              ))}
              {currentPage < totalPages - 2 && <span className="text-gray-300 px-1" aria-hidden="true">...</span>}
              <PageLink page={totalPages} current={currentPage} url={getPageUrl(totalPages)} />
            </>
          ) : (
            getPages().map((page) => (
              <PageLink key={page} page={page} current={currentPage} url={getPageUrl(page)} />
            ))
          )}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            aria-label={t('Next') || 'Next page'}
            className="size-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Link>
        ) : (
          <div className="size-10 flex items-center justify-center rounded-full text-muted-foreground opacity-20 transition-all cursor-not-allowed">
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </div>
        )}

        <div className="h-6 w-px bg-border hidden md:block" />

        {/* Per Page Limit Dropdown */}
        <div className="hidden md:flex items-center gap-2 ltr:ms-2 rtl:me-2">
          <div className="relative group">
            <button className="flex cursor-pointer items-center gap-2 bg-muted/50 hover:bg-muted px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">
              {searchParams.get('limit') || '12'} / {t('PerPage') || 'Page'}
              <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background shadow-2xl rounded-2xl border border-border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-full">
              {[9, 12, 18, 24].map(l => (
                <Link
                  key={l}
                  href={`${pathname}?${(() => {
                    const p = new URLSearchParams(searchParams.toString())
                    p.set('limit', l.toString())
                    p.set('page', '1')
                    return p.toString()
                  })()}`}
                  className={`block w-full text-center text-xs font-bold p-2.5 rounded-xl transition-all ${searchParams.get('limit') === l.toString()
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const PageLink = ({ page, current, url }: { page: number, current: number, url: string }) => (
  <Link
    href={url}
    aria-current={current === page ? 'page' : undefined}
    className={`size-8 flex items-center justify-center rounded-full text-sm font-black transition-all ${current === page
      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110'
      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
      }`}
  >
    {page}
  </Link>
)

