"use client"

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import useAppStore from '@/store/store'
import { ShoppingCart, Trash2, Minus, Plus, FileText, Info } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import PageHeader from '@/components/common/page-header'
import QuoteModal from '@/components/common/QuoteModal'

export default function CartPage() {
  const t = useTranslations('common')
  const locale = useLocale();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useAppStore()
  const [isQuoteOpen, setIsQuoteOpen] = React.useState(false)

  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const countText = locale === 'ar'
    ? `لديك ${count} منتجات في قائمتك`
    : `You have ${count} items in your list`;

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title={t('Cart')} 
        subtitle={countText}
        icon={<ShoppingCart size={28} />}
      />

      <div className="max-w-7xl mx-auto px-4 mt-12 relative z-20">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start"> 
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-black text-[#1a1a1a] font-cairo uppercase tracking-widest">
                    {t('Items')}
                </h3>
                <button 
                  onClick={clearCart}
                  className="text-[11px] font-black tracking-widest text-red-500 hover:text-red-600 bg-red-50/50 hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer uppercase"
                >
                  {t('ClearAll')}
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col md:flex-row items-center gap-5 transition-all hover:border-[#f38d38]/30 group">
                  <div className="size-20 relative bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0">
                    <Image 
                        src={item.main_image || ''} 
                        alt={item.name_ar || 'Product'} 
                        fill 
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-start space-y-1">
                    <h3 className="text-lg font-black text-gray-900 font-cairo tracking-tight">
                      {locale === 'ar' ? item.name_ar : item.name_en}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium line-clamp-1">
                      {locale === 'ar' ? item.short_desc_ar : item.short_desc_en}
                    </p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50/80 rounded-xl p-1 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 cursor-pointer text-gray-400 hover:text-[#f38d38] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-gray-900 font-inter">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 cursor-pointer text-gray-400 hover:text-[#f38d38] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 cursor-pointer bg-gray-50/50 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50/50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
 
            <div className="w-full lg:w-[380px] sticky top-24">
              <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl shadow-gray-200 text-white space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xl font-black font-cairo tracking-tight">{t('OrderSummary')}</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        Ready to request your quote
                    </p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400">
                    <span>{t('Items')}</span>
                    <span className="text-white bg-white/10 px-3 py-1 rounded-lg">{count}</span>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-3 items-start">
                    <Info size={16} className="text-[#f38d38] shrink-0" />
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-300 leading-relaxed font-medium uppercase tracking-[0.05em]">
                            {locale === 'ar' 
                                ? "سيتم مراجعة طلبك وإرسال عرض السعر النهائي قريباً" 
                                : "Your list will be reviewed and a final quote sent shortly"}
                        </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="w-full h-14 bg-[#f38d38] text-white font-black text-sm rounded-xl hover:bg-[#e67e22] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group uppercase tracking-[0.1em] cursor-pointer"
                >
                  <FileText className="group-hover:-translate-y-0.5 transition-transform" size={18} />
                  {t('RequestQuote')}
                </button>

                <QuoteModal 
                  isOpen={isQuoteOpen} 
                  onClose={() => setIsQuoteOpen(false)} 
                  items={cartItems} 
                />
                
                <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest font-black">
                   {t('TermsConditions')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 lg:p-20 text-center max-w-4xl mx-auto bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="size-20 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 group hover:rotate-0 transition-transform">
              <ShoppingCart size={32} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3 font-cairo">
              {t('CartEmpty')}
            </h2>
            <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto font-medium">
              {t('CartDesc')}
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-10 py-3.5 bg-[#f38d38] text-white text-sm font-black rounded-xl hover:bg-[#e67e22] transition-all shadow-xl shadow-orange-100 uppercase tracking-widest"
            >
              {t('BrowseCategories')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
