import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PageHeader from '@/components/common/page-header'
import { ProductCard } from '@/components/common/product-card'
import CategorySidebar from '@/components/common/category-sidebar'
import { getProducts, getCategories, searchProducts, getCategoryBySlug } from '@/services/home'
import { getBrandBySlug } from '@/services/brandService'
import { Search, PackageX } from 'lucide-react'
import FilterProduct from '../../product-category/_components/fillterProduct'
import Pagination from '../../product-category/_components/pagination'
import { getStoreDynamicJsonLd } from '@/seo/storeDynamic'
import { getBrandJsonLd } from '@/seo/brand'
import { storeSlugMetadata } from '@/metadata/storeSlug'
import { brandMetadata } from '@/metadata/brand'

interface StoreDynamicPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>,
  searchParams: Promise<{
    page?: string,
    sort?: string,
    limit?: string,
    view?: string
  }>
}

export async function generateMetadata({ params }: StoreDynamicPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const [category, brand] = await Promise.all([
    getCategoryBySlug(slug),
    getBrandBySlug(slug)
  ])

  if (category) {
    const name = locale === 'ar' ? category.name_ar : category.name_en
    return storeSlugMetadata({
      locale,
      slug,
      title: name || undefined,
      description: (locale === 'ar' ? category.description_ar : category.description_en) || undefined,
    })
  }

  if (brand) {
    return brandMetadata({
        locale,
        slug,
        brand
    })
  }

  const displaySlug = decodeURIComponent(slug).replace(/-/g, ' ')
  return storeSlugMetadata({ locale, slug, title: displaySlug })
}

export default async function StoreDynamicPage({ params, searchParams }: StoreDynamicPageProps) {
  const { locale, slug } = await params
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

  const [category, brand, allCategories, featuredProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getBrandBySlug(slug),
    getCategories(100),
    getProducts({ is_featured: true, limit: 4 })
  ])

  let allProducts = []
  let pageTitle = ''
  let ValsearchQuery = ''

  if (category) {
    allProducts = await getProducts({ categoryId: category.id, limit: 1000 })
    pageTitle = isRtl ? category.name_ar || '' : category.name_en || ''
  } else if (brand) {
    allProducts = await getProducts({ brandId: brand.id, limit: 1000 })
    pageTitle = isRtl ? brand.name_ar || '' : brand.name_en || ''
    ValsearchQuery = pageTitle
  } else {
    const searchQuery = decodeURIComponent(slug).replace(/-/g, ' ')
    allProducts = await searchProducts({ query: searchQuery, limit: 1000 })
    ValsearchQuery = searchQuery
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
      {/* Inline JSON-LD — rendered in initial HTML so Googlebot sees it immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getStoreDynamicJsonLd(locale, {
          isCategory: Boolean(category),
          slug,
          name: pageTitle
        })) }}
      />
      {brand && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBrandJsonLd(locale, { ...brand, slug }, totalItems)) }}
        />
      )}
      <PageHeader
        title={t('Store')}
        parent={{ label: t('Store'), href: '/store' }}
        breadcrumbLabel={ValsearchQuery}
        subtitle={pageTitle}
      />

      <div className="max-w-7xl mx-auto px-4 mt-12 lg:mt-16">
        {brand && (
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-black/5 border border-[#eee1e1] flex flex-col md:flex-row items-center gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-24 h-24 relative flex items-center justify-center bg-white rounded-2xl border border-[#eee1e1] p-4 shrink-0 overflow-hidden shadow-inner">
                    {brand.image_url ? (
                        <img 
                            src={brand.image_url} 
                            alt={pageTitle} 
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Search className="w-12 h-12 text-muted-foreground/20" />
                    )}
                </div>
                <div className="text-center md:text-start flex-1">
                    <h2 className="text-2xl font-black text-[#1a1a1b] mb-1">{pageTitle}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                            <PackageX className="size-3.5 text-primary rotate-180" />
                            <span>{totalItems} {isRtl ? 'منتجات' : 'Products'}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-3 order-2 lg:order-1">
            <CategorySidebar
              categories={allCategories}
              featuredProducts={featuredProducts}
              activeSlug={category ? slug : ""}
            />
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2 space-y-8">

            <FilterProduct
              categoryName={ValsearchQuery}
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