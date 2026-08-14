'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ChevronDown, Layers3, Menu, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Logo from '@/assets/logo.webp'
import LanguageSwitcher from './LanguageSwitcher'
import HeaderActions from './HeaderActions'
import type { Category } from '@/services/categoryService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId)
  const selectedCategoryName = selectedCategory
    ? (locale === 'ar' ? selectedCategory.name_ar : selectedCategory.name_en) || selectedCategory.name_en || selectedCategory.name_ar
    : t('AllCategories')

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchTerm.trim()
    if (!query) return

    const categoryParam = selectedCategoryId ? `?product_cat=${selectedCategoryId}` : ''
    router.push(`/store/${encodeURIComponent(query)}${categoryParam}`)
    setSearchTerm('')
  }

  return (
    <div className="flex h-[106px] items-center border-b bg-white px-4">
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
          className="hidden h-12 max-w-3xl flex-1 items-stretch overflow-hidden rounded-xl border border-primary/70 bg-white shadow-sm transition-shadow focus-within:border-primary focus-within:shadow-md lg:flex"
        >
          <DropdownMenu
            modal={false}
            open={categoryMenuOpen}
            onOpenChange={setCategoryMenuOpen}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('AllCategories')}
                className="flex h-full w-[205px] shrink-0 items-center justify-between gap-3 bg-primary px-4 text-white outline-none transition-colors hover:bg-primary/95 focus-visible:bg-primary/90"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Layers3 className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm font-bold">{selectedCategoryName}</span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              collisionPadding={16}
              className="z-[1000] max-h-[320px] w-[285px] overflow-y-auto rounded-2xl border-border/70 bg-white p-1.5 shadow-2xl"
            >
              <DropdownMenuItem
                onSelect={() => setSelectedCategoryId('')}
                className="flex min-h-10 cursor-pointer justify-between rounded-xl px-3 text-sm font-bold text-primary focus:bg-primary/10 focus:text-primary [&_svg]:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <Layers3 className="h-4 w-4" />
                  {t('AllCategories')}
                </span>
                {!selectedCategoryId && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-2 bg-border/70" />
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onSelect={() => setSelectedCategoryId(category.id)}
                  className="flex min-h-10 cursor-pointer justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:bg-primary/10 focus:text-primary"
                >
                  <span className="truncate">
                    {(locale === 'ar' ? category.name_ar : category.name_en) || category.name_en || category.name_ar}
                  </span>
                  {selectedCategoryId === category.id && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('Search')}
            aria-label={t('Search')}
            className="min-w-0 flex-1 bg-white px-4 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            aria-label={t('Search')}
            className="flex w-14 shrink-0 cursor-pointer items-center justify-center bg-primary text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          >
            <Search className="h-5 w-5" />
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
