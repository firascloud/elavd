'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { searchProducts, type Product } from '@/services/productService'
import { getCategories, type Category } from '@/services/categoryService'
import { ProductCard } from '@/components/common/product-card'
import { ProductCardSkeleton } from '@/components/common/ProductCardSkeleton'
import { PackageX, Grid, List, ChevronRight, LayoutGrid, Star, Tag, SlidersHorizontal, ChevronLeft } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

interface SearchResultsProps {
  query: string
  categoryId?: string
}

export default function SearchResults({ query, categoryId }: SearchResultsProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [prodData, catData, featData] = await Promise.all([
          searchProducts({ query, categoryId: categoryId === '0' ? undefined : categoryId, limit: 20 }),
          getCategories(10),
          searchProducts({ query: '', limit: 3 }) // Featured products for sidebar
        ])
        setProducts(prodData)
        setCategories(catData)
        setFeaturedProducts(featData)
      } catch (error) {
        console.error('Failed to fetch search data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [query, categoryId])

  const getProductName = (product: Product): string => {
    return (locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar) || ''
  }

  return (
    <div className="min-h-screen bg-background font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search Header Banner */}
      <div className="bg-foreground py-16 lg:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-4">
            <span className="text-primary-foreground/60 font-light">{isRtl ? 'نتائج البحث عن: ' : 'Search Results for: '}</span>
            {query}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs & Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">{t('Home')}</Link>
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'المتجر' : 'Shop'}</span>
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="text-foreground font-semibold">{isRtl ? `نتائج البحث عن "${query}"` : `Search results for "${query}"`}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground uppercase ltr:tracking-wider">{isRtl ? 'عرض:' : 'Show:'}</span>
              {[9, 12, 18, 24].map((num) => (
                <button key={num} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{num}</button>
              ))}
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewType('grid')}
                className={`p-1.5 rounded transition-colors ${viewType === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded transition-colors ${viewType === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-bold text-foreground bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="newest">{isRtl ? 'الملاءمة' : 'Relevance'}</option>
                <option value="price_low">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price_high">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                {products.map((prod) => (
                  <ProductCard key={prod.id} {...prod} is_hot={prod.is_featured} />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                <PackageX className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold text-foreground">{t('NoResultsFound')}</h3>
                <p className="text-muted-foreground mt-2">{isRtl ? 'لم نجد أي نتائج لبحثك. حاول استخدام كلمات مفتاحية أخرى.' : 'No results found for your search. Try different keywords.'}</p>
                <Link href="/" className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  {isRtl ? 'العودة للمتجر' : 'Back to Shop'}
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-8 order-1 lg:order-2">
            {/* Categories Widget */}
            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-primary-foreground font-bold text-lg">{isRtl ? 'الأقسام' : 'Categories'}</h3>
              </div>
              <div className="p-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?s=${query}&product_cat=${cat.id}`}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${categoryId === cat.id ? 'bg-primary/5 text-primary' : 'hover:bg-muted/30 text-foreground'}`}
                  >
                    <span className="font-bold text-sm">{isRtl ? cat.name_ar : cat.name_en}</span>
                    {isRtl ? <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> : <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Products Widget */}
            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-primary-foreground font-bold text-lg">{isRtl ? 'منتجات مميزة' : 'Featured Products'}</h3>
              </div>
              <div className="p-4 space-y-4">
                {featuredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${(isRtl ? prod.slug_ar : prod.slug_en) || prod.id}`}
                    className="flex gap-4 group p-2 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-border"
                  >
                    <div className="relative w-20 h-20 bg-muted/30 rounded-lg overflow-hidden shrink-0">
                      {prod.main_image ? (
                        <Image
                          src={prod.main_image}
                          alt={getProductName(prod)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                        {getProductName(prod)}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {prod.price && (
                          <span className="text-xs font-bold text-primary">
                            {prod.price} {t('SAR')}
                          </span>
                        )}
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-muted-foreground">5.0</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Widget - Optional visually inferred from image bottom right (WhatsApp icons) */}
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-primary text-xl">📞</span>
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1">{isRtl ? 'هل تحتاج لمساعدة؟' : 'Need Help?'}</h4>
              <p className="text-xs text-muted-foreground mb-4">{isRtl ? 'تواصل معنا في أي وقت' : 'Contact us anytime'}</p>
              <div className="flex flex-col gap-2">
                <a href="tel:0556482799" className="text-sm font-bold text-primary hover:underline font-mono">0556482799</a>
                <a href="tel:0553202091" className="text-sm font-bold text-primary hover:underline font-mono">0553202091</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
