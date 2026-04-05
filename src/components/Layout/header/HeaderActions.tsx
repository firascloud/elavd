'use client'

import React from 'react'
import { ShoppingCart, Heart, Repeat } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useAppStore from '@/store/store'
import { Link } from '@/i18n/routing'

export default function HeaderActions() {
  const t = useTranslations('common')
  const { wishlist, compareItems, cartItems } = useAppStore()

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-4 text-xs font-medium mr-4">
        <Link href="/favorite" className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-2.5 rounded-full bg-slate-50 group-hover:bg-primary/10 transition relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#f38d38] fill-[#f38d38]' : 'text-foreground group-hover:text-primary'}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 size-4 bg-[#f38d38] text-white text-[10px] rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>{t('Wishlist')}</span>
        </Link>
        <Link href="/compare" className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="p-2.5 rounded-full bg-slate-50 group-hover:bg-primary/10 transition relative">
            <Repeat className={`w-5 h-5 ${compareItems.length > 0 ? 'text-[#f38d38]' : 'text-foreground group-hover:text-primary'}`} />
            {compareItems.length > 0 && (
              <span className="absolute top-0 right-0 size-4 bg-[#f38d38] text-white text-[10px] rounded-full flex items-center justify-center">
                {compareItems.length}
              </span>
            )}
          </div>
          <span>{t('Compare')}</span>
        </Link>
      </div>

      <Link href="/cart" className="flex items-center gap-3 pl-4 border-l border-border group cursor-pointer">
        <div className="bg-[#f38d38] p-3 rounded-lg text-white shadow-md shadow-primary/20 group-hover:shadow-lg transition-all group-hover:-translate-y-0.5 relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-[#1a1a1a] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-muted-foreground">{t('Items')} ({cartCount})</span>
          <span className="text-sm font-bold truncate max-w-[100px]">{t('Total')} : {cartTotal} {t('Currency')}</span>
        </div>
      </Link>
    </div>
  )
}

