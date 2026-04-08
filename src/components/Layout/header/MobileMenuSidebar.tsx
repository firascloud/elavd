'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { X, ChevronRight, Tag, Heart, Repeat, ShoppingCart, User, Phone } from 'lucide-react'
import { Icon } from '@iconify/react'
import { useTranslations, useLocale } from 'next-intl'
import Logo from '@/assets/logo.svg'
import type { Category } from '@/services/categoryService'

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
}

interface MobileMenuSidebarProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  navLinks: NavLink[]
  categories: Category[]
}

export default function MobileMenuSidebar({ menuOpen, setMenuOpen, navLinks, categories }: MobileMenuSidebarProps) {
  const t = useTranslations('common')
  const locale = useLocale()

  if (!menuOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setMenuOpen(false)}
      />

      <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
        <div className="bg-foreground px-4 py-4 flex items-center justify-between shrink-0">
          <Image
            src={Logo}
            alt="Logo"
            width={120}
            height={120}
            className="w-24 h-auto brightness-0 invert"
          />
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          <p className="px-4 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {t('MenuTitle')}
          </p>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors group"
            >
              <span className="text-primary">{link.icon}</span>
              {link.label}
              <ChevronRight className="w-4 h-4 ms-auto text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}

          <p className="px-4 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            {t('BrowseCategories')}
          </p>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/store/${cat.slug_en}`}
              className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors group"
            >
              <Tag className="w-5 h-5 text-primary" />
              {locale === 'ar' ? cat.name_ar : cat.name_en}
              <ChevronRight className="w-4 h-4 ms-auto text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100" />

        {/* Account actions */}
        <div className="flex flex-col py-2">
          <p className="px-4 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {t('MyAccount') ?? 'My Account'}
          </p>

          <button className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors w-full text-start">
            <Heart className="w-5 h-5 text-primary" />
            {t('Wishlist') ?? 'Wishlist'}
          </button>

          <button className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors w-full text-start">
            <Repeat className="w-5 h-5 text-primary" />
            {t('Compare') ?? 'Compare'}
          </button>

          {/* <button className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors w-full text-start">
            <ShoppingCart className="w-5 h-5 text-primary" />
            {t('Cart') ?? 'Cart'}
          </button> */}

          <button className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors w-full text-start">
            <User className="w-5 h-5 text-primary" />
            {t('Account') ?? 'Account'}
          </button>
        </div>

        <div className="border-t border-slate-100" />

        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="p-2 rounded-full bg-primary/10">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight" dir="ltr">00966551628281</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <Icon icon="mdi:email" className="w-4 h-4 text-primary" />
            <span>sales@elavd.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
