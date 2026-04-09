import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import PageHeader from '@/components/common/page-header'
import { ProductCard } from '@/components/common/product-card'
import CategorySidebar from '@/components/common/category-sidebar'
import { getCategoryBySlug, getProducts, getCategories, Product } from '@/services/home'
import { Search } from 'lucide-react'
import FilterProduct from '../_components/fillterProduct'
import Pagination from '../_components/pagination'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { getCategoryJsonLd } from '@/seo/category'
import { categoryMetadata } from '@/metadata/category'

interface CategoryPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return { title: 'Category Not Found' }

  return categoryMetadata({ locale, slug, category: category as any })
}

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ locale: string, slug: string }>,
  searchParams: Promise<{ page?: string, sort?: string, limit?: string, view?: string }>
}) {
  const { slug, locale } = await params
  const { page = '1', sort = 'default', limit = '12', view = 'grid' } = await searchParams

  const t = await getTranslations('common')
  const isRtl = locale === 'ar'

  const currentPage = parseInt(page)
  const currentLimit = parseInt(limit)

  // Data fetching
  const [category, allCategories, featuredProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(10),
    getProducts({ is_featured: true, limit: 4 })
  ])

  if (!category) {
    notFound()
  }

  let allCategoryProducts = await getProducts({ categoryId: category.id, limit: 1000 })

  if (sort === 'newest') {
    allCategoryProducts = [...allCategoryProducts].sort((a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  } else if (sort === 'price-low') {
    allCategoryProducts = [...allCategoryProducts].sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sort === 'price-high') {
    allCategoryProducts = [...allCategoryProducts].sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  const totalItems = allCategoryProducts.length
  const totalPages = Math.ceil(totalItems / currentLimit)


  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = startIndex + currentLimit
  const paginatedProducts = allCategoryProducts.slice(startIndex, endIndex)

  const categoryName = isRtl ? category.name_ar : category.name_en

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Script id="jsonld-category" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(getCategoryJsonLd(locale, {
          slug: (category as any).slug ?? "",
          name_ar: category.name_ar ?? undefined,
          name_en: category.name_en ?? undefined,
          description_ar: category.description_ar ?? undefined,
          description_en: category.description_en ?? undefined
        }))}
      </Script>
      <PageHeader
        title={categoryName || ''}
      />

      <div className="max-w-7xl mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <aside className="lg:col-span-3 order-2 lg:order-1">
            <CategorySidebar
              categories={allCategories}
              featuredProducts={featuredProducts}
              activeSlug={slug}
            />
          </aside>

          <section className="lg:col-span-9 order-1 lg:order-2 space-y-8" aria-label={t('Products')}>

            <FilterProduct
              categoryName={categoryName || ''}
              totalItems={totalItems}
              currentView={view}
            />

            {/* Grid */}
            {paginatedProducts.length > 0 ? (
              <div className={`grid  ${view === 'list'
                ? 'grid-cols-1 gap-8'
                : view === 'grid-2'
                  ? 'grid-cols-1 sm:grid-cols-2 gap-8'
                  : view === 'grid-4'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                }`}>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    view={view === 'list' ? 'list' : 'grid'}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-md border border-gray-100 shadow-sm">
                <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Search size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 font-cairo mb-2">
                    {t('NoProductsFound')}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium">
                    {t('NoProductsDescription')}
                  </p>
                </div>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
