'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Logo from '@/assets/logo.webp'
import LanguageSwitcher from './LanguageSwitcher'
import HeaderActions from './HeaderActions'
import type { Category } from '@/services/categoryService'

interface LogoSectionProps {
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  categories: Category[]
}

export default function LogoSection({ setSearchOpen, setMenuOpen, categories }: LogoSectionProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchTerm.trim()
    if (!query) return

    const categoryParam = selectedCategoryId ? `?product_cat=${selectedCategoryId}` : ''
    router.push(`/store/${encodeURIComponent(query)}${categoryParam}`)
    setSearchTerm('')
  }

  return (
    <div className="bg-white h-[106px] flex items-center px-4 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6 w-full">
        <Link href="/" className="shrink-0">
          <Image
            src={Logo}
            alt="Logo"
            width={200}
            height={80}
            priority
            className="w-28 lg:w-48 h-auto max-h-[70px] lg:max-h-[80px] object-contain"
          />
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-2xl h-11 border-2 border-primary rounded-lg overflow-hidden"
        >
          <select
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            aria-label={t('AllCategories')}
            className="bg-primary px-3 h-full text-white text-sm font-bold border-0 outline-none min-w-[130px] max-w-[180px]"
          >
            <option value="">{t('AllCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {locale === 'ar' ? category.name_ar : category.name_en}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('Search')}
            aria-label={t('Search')}
            className="flex-1 min-w-0 px-4 text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            aria-label={t('Search')}
            className="bg-primary px-6 flex items-center justify-center text-white hover:bg-primary/95 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden lg:block">
          <HeaderActions />
        </div>
      </div>
    </div>
  )
}
