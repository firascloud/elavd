'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, Search, Loader2, Star, Tag, ChevronRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { getCategories, type Category } from '@/services/categoryService'
import { searchProducts, type Product } from '@/services/productService'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchOverlayProps {
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
}

export default function SearchOverlay({ searchOpen, setSearchOpen, searchInputRef }: SearchOverlayProps) {
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

  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    if (searchOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [searchOpen, setSearchOpen])

  // Close category menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catMenuRef.current && !catMenuRef.current.contains(event.target as Node)) {
        setShowCatMenu(false)
      }
    }
    if (showCatMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCatMenu])

  const handleSearchRedirect = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchTerm.trim()) return
 
    const categoryParam = selectedCategory ? `?product_cat=${selectedCategory.id}` : ''
    router.push(`/store/${encodeURIComponent(searchTerm)}${categoryParam}`)
    setSearchOpen(false)
  }

  const getProductName = (product: Product): string => {
    return (locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar) || ''
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('SearchProducts')}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative bg-white shadow-2xl px-4 pt-4 pb-5 rounded-b-2xl"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <span className="text-base font-bold text-slate-800">{t('SearchProducts')}</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 cursor-pointer rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <form 
                onSubmit={handleSearchRedirect}
                className="flex h-[52px] border-2 border-slate-200 rounded-xl transition-all relative"
              > 
                <div className="relative z-[120]" ref={catMenuRef}>
                  <button 
                    type="button"
                    onClick={() => setShowCatMenu(!showCatMenu)}
                    className="bg-slate-50 h-full px-3 sm:px-4 flex items-center gap-2 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors border-e border-slate-200 min-w-[100px] sm:min-w-[120px] justify-center rounded-s-[9px] outline-none"
                  >
                    <span className="text-sm font-semibold truncate max-w-[110px]">
                      {selectedCategory ? (locale === 'ar' ? selectedCategory.name_ar : selectedCategory.name_en) : t('All')}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCatMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showCatMenu && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full start-0 mt-2 w-72 max-w-[85vw] bg-white rounded-md shadow-md border border-slate-100 z-[110] py-2 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(null)
                            setShowCatMenu(false)
                          }}
                          className={`w-full cursor-pointer px-4 py-2.5 text-start text-sm hover:bg-primary/5 transition-colors flex items-center gap-2 ${!selectedCategory ? 'text-primary font-bold' : 'text-slate-600'}`}
                        >
                          <Tag className="w-4 h-4" />
                          {t('AllCategories')}
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat)
                              setShowCatMenu(false)
                            }}
                            className={`w-full cursor-pointer px-4 py-2.5 text-start text-sm hover:bg-primary/5 transition-colors flex items-center gap-3 ${selectedCategory?.id === cat.id ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                              {cat.image_url ? (
                                <Image src={cat.image_url} alt={cat.name_en || ''} width={32} height={32} className="object-cover w-full h-full" />
                              ) : (
                                <Tag className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{locale === 'ar' ? cat.name_ar : cat.name_en}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{locale === 'ar' ? cat.name_en : cat.name_ar}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('SearchPlaceholder') || "What are you looking for?"}
                  className="flex-1 px-4 text-base outline-none focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-slate-400 bg-white font-medium"
                />
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-primary cursor-pointer px-0 md:px-6 flex items-center justify-center text-white hover:bg-primary/90 transition-all disabled:opacity-80 active:scale-95 rounded-e-[9px]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </form>

              {/* Search Results Menu */}
              <AnimatePresence>
                {searchTerm.length >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full start-0 end-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
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
                          <Link href={`/store/${searchTerm}`} className="text-primary hover:underline" onClick={() => setSearchOpen(false)}>
                            {t('ViewAll')}
                          </Link>
                        </div>
                        <div className="space-y-1">
                          {results.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${(locale === 'ar' ? product.slug_ar : product.slug_en) || product.id}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                            >
                              <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                {product.main_image ? (
                                  <Image 
                                    src={product.main_image} 
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
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors rtl:rotate-180" />
                            </Link>
                          ))}
                        </div>
                        <button
                          onClick={handleSearchRedirect}
                          className="w-full cursor-pointer mt-2 py-3 bg-slate-50 text-slate-600 text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 rounded-xl"
                        >
                          {t('ShowAllResultsFor')} "{searchTerm}"
                          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                      </div>
                    ) : searchTerm.length >= 2 ? (
                      <div className="p-10 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{t('NoResultsFound')}</p>
                          <p className="text-xs text-slate-400 mt-1">{t('TryDifferentKeywords')}</p>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
