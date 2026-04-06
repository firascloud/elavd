'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export default function FloatingActions() {
  const phone = '+966556482799'
  const whatsapp = '+966553202091'

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">

      <a
        href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full 
        bg-gradient-to-br from-[#25D366] to-[#1ebe5d]
        text-white shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
      >

        <Icon icon="mdi:whatsapp" className="w-7 h-7 relative z-10" />

        <span className="absolute right-full top-1/2 -translate-y-1/2 me-3 
        px-3 py-1.5 rounded-lg text-xs font-medium 
        bg-black/80 backdrop-blur-md text-white 
        opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
        transition-all duration-300 whitespace-nowrap shadow-xl">
          تواصل عبر واتساب
        </span>
      </a>

      <a
        href={`tel:${phone}`}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full 
        bg-primary
        text-white shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Call Us"
      >
        <Icon icon="mdi:phone" className="w-6 h-6 relative z-10" />

        <span className="absolute right-full top-1/2 -translate-y-1/2 me-3 
        px-3 py-1.5 rounded-lg text-xs font-medium 
        bg-black/80 backdrop-blur-md text-white 
        opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
        transition-all duration-300 whitespace-nowrap shadow-xl">
          اتصل بنا الآن
        </span>
      </a>

    </div>
  )
}