import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PageHeader from '@/components/common/page-header'
import { ProductCard } from '@/components/common/product-card'
import CategorySidebar from '@/components/common/category-sidebar'
import { getProducts, getCategories, searchProducts } from '@/services/home'
import { getSubCategoryBySlug } from '@/services/subCategoryService'
import { Search, PackageX } from 'lucide-react'
import FilterProduct from '../../../product-category/_components/fillterProduct'
import Pagination from '../../../product-category/_components/pagination'
import Script from 'next/script'
import { getStoreDynamicJsonLd } from '@/seo/storeDynamic'
import { storeSubSlugMetadata } from '@/metadata/storeSubSlug'

interface SubCategoryPageProps {
  params: Promise<{
    locale: string
    slug: string
    subSlug: string
  }>,
  searchParams: Promise<{
    page?: string,
    sort?: string,
    limit?: string,
    view?: string
  }>
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { subSlug, slug, locale } = await params
  const subCategory = await getSubCategoryBySlug(subSlug)
  const t = await getTranslations('common')

  if (subCategory) {
    const name = locale === 'ar' ? subCategory.name_ar : subCategory.name_en
    return storeSubSlugMetadata({
      locale,
      slug,
      subSlug,
      title: name || undefined,
      description: (locale === 'ar' ? subCategory.description_ar : subCategory.description_en) || undefined,
    })
  }

  const displaySlug = decodeURIComponent(subSlug).replace(/-/g, ' ')
  return storeSubSlugMetadata({ locale, slug, subSlug, title: displaySlug })
}

export default async function SubCategoryPage({ params, searchParams }: SubCategoryPageProps) {
  const { locale, slug, subSlug } = await params
  const {
    page = '1',
    sort = 'default',
    limit = '12',
    view = 'grid'
  } = await searchParams

  const t = await getTranslations('common')
  const isRtl = locale === 'ar'

  const currentPage = parseInt(page)
  const currentLimit = parseInt(limit)

  const [subCategory, allCategories, featuredProducts] = await Promise.all([
    getSubCategoryBySlug(subSlug),
    getCategories(100), // Fetch all categories to show in sidebar
    getProducts({ is_featured: true, limit: 4 })
  ])

  let allProducts = []
  let pageTitle = ''

  if (subCategory) {
    allProducts = await getProducts({ subCategoryId: subCategory.id, limit: 1000 })
    pageTitle = isRtl ? subCategory.name_ar || '' : subCategory.name_en || ''
  } else {
    const searchQuery = decodeURIComponent(subSlug).replace(/-/g, ' ')
    allProducts = await searchProducts({ query: searchQuery, limit: 1000 })
    pageTitle = isRtl ? `نتائج البحث عن: ${searchQuery}` : `Search results for: ${searchQuery}`
  }

  if (sort === 'newest') {
    allProducts = [...allProducts].sort((a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  } else if (sort === 'price-low') {
    allProducts = [...allProducts].sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sort === 'price-high') {
    allProducts = [...allProducts].sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  const totalItems = allProducts.length
  const totalPages = Math.ceil(totalItems / currentLimit)

  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = startIndex + currentLimit
  const paginatedProducts = allProducts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Script id="jsonld-subcategory" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(getStoreDynamicJsonLd(locale, {
          isCategory: true,
          slug: subSlug,
          name: pageTitle
        }))}
      </Script>
      <PageHeader
        title={t('Store')}
        parent={{ label: t('Store'), href: '/store' }}
        breadcrumbLabel={pageTitle}
        subtitle={pageTitle}
      />

      <div className="max-w-7xl mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-3 order-2 lg:order-1">
            <CategorySidebar
              categories={allCategories as any}
              featuredProducts={featuredProducts}
              activeSlug={subSlug}
            />
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2 space-y-8">

            <FilterProduct
              categoryName={pageTitle}
              totalItems={totalItems}
              currentView={view}
            />

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
                  <PackageX size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 font-cairo mb-2">
                    {t('NoResultsFound')}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium">
                    {t('NoResultsFound')}
                  </p>
                </div>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
