'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { ChevronUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

export default function FloatingActions() {
  const t = useTranslations('common')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const [showScroll, setShowScroll] = useState(false)

  const phone = '+966556482799'
  const whatsapp = '+966553202091'

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true)
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [showScroll])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div 
      className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-[9999] flex flex-col gap-3 transition-all duration-500`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`group relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full 
        bg-white border border-border text-foreground shadow-lg hover:shadow-2xl 
        hover:border-primary hover:text-primary transition-all duration-500 
        ${showScroll ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        aria-label={t('BackToTop') || 'Back to top'}
      >
        <ChevronUp className="size-5" />
        <span className={`absolute ${isRtl ? 'left-full' : 'right-full'} top-1/2 -translate-y-1/2 ${isRtl ? 'ms-3' : 'me-3'} 
        px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
        bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 
        ${isRtl ? '-translate-x-2' : 'translate-x-2'} group-hover:translate-x-0 transition-all shadow-xl`}>
          {isRtl ? 'إلى الأعلى' : 'Back to top'}
        </span>
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full 
        bg-gradient-to-br from-[#25D366] to-[#1ebe5d]
        text-white shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
      >
        <Icon icon="mdi:whatsapp" className="w-6 h-6 relative z-10" />
        <span className={`absolute ${isRtl ? 'left-full' : 'right-full'} top-1/2 -translate-y-1/2 ${isRtl ? 'ms-3' : 'me-3'} 
        px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
        bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 
        ${isRtl ? '-translate-x-2' : 'translate-x-2'} group-hover:translate-x-0 transition-all shadow-xl`}>
          {isRtl ? 'تواصل عبر واتساب' : 'WhatsApp'}
        </span>
      </a>

      {/* Phone */}
      <a
        href={`tel:${phone}`}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full 
        bg-primary
        text-white shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Call Us"
      >
        <Icon icon="mdi:phone" className="size-5 relative z-10" />
        <span className={`absolute ${isRtl ? 'left-full' : 'right-full'} top-1/2 -translate-y-1/2 ${isRtl ? 'ms-3' : 'me-3'} 
        px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
        bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 
        ${isRtl ? '-translate-x-2' : 'translate-x-2'} group-hover:translate-x-0 transition-all shadow-xl`}>
          {isRtl ? 'اتصل بنا الآن' : 'Call us now'}
        </span>
      </a>

    </div>
  )
}
