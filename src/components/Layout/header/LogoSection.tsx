'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search, ChevronDown, Menu, Loader2, Star, Tag, ChevronRight } from 'lucide-react'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import Logo from '@/assets/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'
import HeaderActions from './HeaderActions'
import { getCategories, type Category } from '@/services/categoryService'
import { searchProducts, type Product } from '@/services/productService'
import { motion, AnimatePresence } from 'framer-motion'

interface LogoSectionProps {
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
}

export default function LogoSection({ setSearchOpen, setMenuOpen }: LogoSectionProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)

  const catMenuRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Initial category fetch
  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories(20)
      setCategories(data)
    }
    fetchCats()
  }, [])

  // Live search effect
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length >= 2) {
        setLoading(true)
        try {
          const data = await searchProducts({
            query: searchTerm,
            categoryId: selectedCategory?.id,
            limit: 6
          })
          setResults(data)
        } catch (error) {
          console.error('Search failed:', error)
          setResults([])
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
        setLoading(false)
      }
    }

    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setShowCatMenu(false)
      }
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        // We don't necessarily want to clear searchTerm here, but maybe hide the results
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchRedirect = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchTerm.trim()) return

    // Redirect to slug-based store search
    const categoryParam = selectedCategory ? `?product_cat=${selectedCategory.id}` : ''
    router.push(`/store/${encodeURIComponent(searchTerm)}${categoryParam}`)
    setSearchTerm('')
  }

  const getProductName = (product: Product): string => {
    return (locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar) || ''
  }

  return (
    <div className="bg-white h-[106px] flex items-center px-4 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6 w-full">
        <Link href="/" className="shrink-0">
          <Image src={Logo} alt="Logo" width={200} height={200} className="w-32 lg:w-48 h-auto" />
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-2xl w-full relative">
          <form
            onSubmit={handleSearchRedirect}
            className="flex h-11 border-2 border-primary rounded-lg group focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full relative"
          >
            {/* Category Select */}
            <div className="relative z-[120]" ref={catMenuRef}>
              <div
                onClick={() => setShowCatMenu(!showCatMenu)}
                className="bg-primary px-4 h-full flex items-center text-white cursor-pointer hover:bg-primary/95 transition border-r border-primary/20 gap-3 min-w-[130px] justify-center rounded-s-[6px]"
              >
                <span className="text-sm font-bold truncate max-w-[100px]">
                  {selectedCategory ? (locale === 'ar' ? selectedCategory.name_ar : selectedCategory.name_en) : t('All')}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCatMenu ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showCatMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] py-2 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null)
                        setShowCatMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-start text-sm hover:bg-primary/5 transition-colors ${!selectedCategory ? 'text-primary font-bold' : 'text-slate-600'}`}
                    >
                      {t('AllCategories')}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat)
                          setShowCatMenu(false)
                        }}
                        className={`w-full px-4 py-2.5 text-start text-sm hover:bg-primary/5 transition-colors flex items-center gap-3 ${selectedCategory?.id === cat.id ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                          {cat.image_url ? (
                            <Image src={cat.image_url} alt={cat.name_en || ''} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <Tag className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold truncate">{locale === 'ar' ? cat.name_ar : cat.name_en}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{locale === 'ar' ? cat.name_en : cat.name_ar}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('Search')}
              className="flex-1 px-4 text-sm outline-none placeholder:text-muted-foreground/60"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-primary px-6 flex items-center justify-center text-white hover:bg-primary/95 transition disabled:opacity-80 rounded-e-[6px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Desktop Results Menu */}
          <AnimatePresence>
            {searchTerm.length >= 2 && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
              >
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-sm text-slate-500 font-medium">{t('Searching')}...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                      <span>{t('TopResults')} ({results.length})</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${(locale === 'ar' ? product.slug_ar : product.slug_en) || product.id}`}
                          onClick={() => setSearchTerm('')}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                        >
                          <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            {product.main_image ? (
                              <Image
                                src={product.main_image || ''}
                                alt={getProductName(product)}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-5 h-5 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                              {getProductName(product)}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {product.price && (
                                <span className="text-xs font-bold text-primary">
                                  {product.price} {t('SAR')}
                                </span>
                              )}
                              {product.is_featured && (
                                <span className="flex items-center text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                  <Star className="w-2.5 h-2.5 fill-amber-700 me-0.5" />
                                  {t('Featured')}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                    <button
                      onClick={handleSearchRedirect}
                      className="w-full mt-2 py-3 bg-slate-50 text-slate-600 text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 rounded-xl"
                    >
                      {t('ShowAllResultsFor')} "{searchTerm}"
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">{t('NoResultsFound')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tablet Search/Actions Toggle */}
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
