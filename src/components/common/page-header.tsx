'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  breadcrumbLabel?: string
  parent?: {
    label: string
    href: string
  }
}

export default function PageHeader({ title, subtitle, icon, parent, breadcrumbLabel }: PageHeaderProps) {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1a1a] py-8 sm:py-10 lg:py-10">
       <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f38d38]/5 blur-[120px] rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-[#f38d38]/10 blur-[100px] rounded-full -translate-x-1/2" />
      
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-400 mb-6 sm:mb-8 font-cairo"
          >
            <Link href="/" className="hover:text-[#f38d38] flex items-center gap-1.5 transition-colors">
              <Home className="size-3 sm:size-3.5 lg:size-[14px]" />
              <span className="hidden sm:inline">{t('Home')}</span>
            </Link>
            
            {parent && (

              <>
                {locale === 'ar' ? <ChevronLeft className="size-3 sm:size-[14px]" /> : <ChevronRight className="size-3 sm:size-[14px]" />}
                <Link href={parent.href} className="hover:text-[#f38d38] transition-colors whitespace-nowrap">
                  {parent.label}
                </Link>
              </>
            )}

            {locale === 'ar' ? <ChevronLeft className="size-3 sm:size-[14px]" /> : <ChevronRight className="size-3 sm:size-[14px]" />}
            <span className="text-[#f38d38] font-bold truncate max-w-[150px] sm:max-w-none">
              {breadcrumbLabel || title}
            </span>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center w-full"
          >
            {icon && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 text-[#f38d38] backdrop-blur-sm">
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight font-cairo leading-tight sm:leading-normal">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl font-medium px-4 sm:px-0">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
