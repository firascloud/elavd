"use client"

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { ShoppingCart, Trash2, Minus, Plus, CreditCard } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import PageHeader from '@/components/common/page-header'

export default function CartPage() {
  const t = useTranslations('common')
  const locale = useLocale();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useAppStore()

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const countText = locale === 'ar'
    ? `لديك ${count} منتجات في سلتك`
    : `You have ${count} items in your cart`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader 
        title={t('Cart')} 
        subtitle={countText}
        icon={<ShoppingCart size={32} />}
      />

      <div className="container mx-auto px-4 mt-10 relative z-20">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8"> 
            <div className="flex-1 space-y-4">
               <div className="flex items-center justify-end mb-2">
                <button 
                  onClick={clearCart}
                  className="text-xs font-bold text-[#d32f2f] hover:bg-white px-3 py-1 rounded-lg transition-colors"
                >
                  {t('ClearAll')}
                </button>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row items-center gap-6 group transition-all hover:shadow-2xl hover:shadow-gray-200/60">
                  <div className="size-24 relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    <Image src={item.main_image || ''} alt={item.name_ar || 'Product'} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-start">
                    <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1 font-cairo">
                      {locale === 'ar' ? item.name_ar : item.name_en}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {locale === 'ar' ? item.short_desc_ar : item.short_desc_en}
                    </p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 rounded-2xl px-3 py-1.5 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-gray-400 hover:text-[#f38d38] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-900 font-inter">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-gray-400 hover:text-[#f38d38] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-center md:text-right min-w-[120px]">
                    <div className="text-2xl font-black text-[#f38d38] font-inter">
                      {((item.price || 0) * item.quantity)}
                      <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">{t('Currency')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 bg-gray-50 rounded-2xl text-gray-300 hover:text-red-500 transition-all hover:bg-red-50"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
 
            <div className="w-full lg:w-[400px] space-y-6">
              <div className="bg-[#1a1a1a] rounded-[2.5rem] p-10 shadow-2xl shadow-gray-400/30 text-white space-y-8 sticky top-24">
                <h4 className="text-2xl font-extrabold font-cairo">{t('OrderSummary')}</h4>
                
                <div className="space-y-4 pt-2 text-base">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('Items')} ({count})</span>
                    <span className="font-bold">{total} {t('Currency')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{t('ShippingFees')}</span>
                    <span className="text-[#f38d38] font-black">{t('Free')}</span>
                  </div>
                  <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xl font-bold">{t('Total')}</span>
                    <div className="text-3xl font-black text-[#f38d38] font-inter">{total} {t('Currency')}</div>
                  </div>
                </div>

                <Link 
                  href="#"
                  className="w-full py-5 bg-[#f38d38] text-white font-black text-lg rounded-[1.5rem] hover:bg-[#e67e22] transition-all flex items-center justify-center gap-4 shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                  <CreditCard className="group-hover:translate-x-1" size={24} />
                  {t('CheckoutNow')}
                </Link>
                
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                   {locale === 'ar' ? 'تطبق الشروط والأحكام' : 'Terms & Conditions Apply'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 lg:p-24 text-center  max-w-4xl mx-auto">
            <div className="size-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-6 transition-transform hover:rotate-0">
              <ShoppingCart size={44} className="text-gray-200" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 font-cairo">
              {t('CartEmpty')}
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto">
              {t('CartDesc')}
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-10 py-4 bg-[#f38d38] text-white font-bold rounded-2xl hover:bg-[#e67e22] transition-all shadow-xl shadow-orange-200"
            >
              {t('BrowseCategories')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
