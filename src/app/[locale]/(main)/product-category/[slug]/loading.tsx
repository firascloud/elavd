import React from 'react'
import { ProductCardSkeleton } from '@/components/common/product-card-skeleton'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="h-48 w-full bg-white animate-pulse" />  

      <div className="max-w-7xl mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
           
          <div className="lg:col-span-3">
             <div className="h-[600px] bg-white rounded-3xl border border-gray-100 animate-pulse" /> {/* Sidebar Skeleton */}
          </div>
 
          <div className="lg:col-span-9 space-y-8">
            <div className="h-20 bg-white rounded-3xl border border-gray-100 animate-pulse" /> {/* Filter Skeleton */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
