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
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1a1a] py-10">
       <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f38d38]/5 blur-[120px] rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-[#f38d38]/10 blur-[100px] rounded-full -translate-x-1/2" />
      
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
            <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-cairo"
          >
            <Link href="/" className="hover:text-[#f38d38] flex items-center gap-1 transition-colors">
              <Home size={14} />
              {t('Home')}
            </Link>
            {locale === 'ar' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            <span className="text-[#f38d38] font-bold">{title}</span>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            {icon && (
              <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 text-[#f38d38] backdrop-blur-sm">
                {icon}
              </div>
            )}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight font-cairo">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-lg max-w-2xl font-medium">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
