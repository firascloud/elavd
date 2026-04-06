'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Search, Menu, Phone, ChevronDown, X,
  Heart, Repeat, ShoppingCart, User,
  Tag, Info, Mail, ChevronRight, Home
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Icon } from '@iconify/react'
import Logo from '@/assets/dneest-logo.webp'
import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'
import HeaderActions from '@/components/Layout/header/HeaderActions'

export function Header() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: t('Home'), icon: <Home className="w-5 h-5" /> },
    { href: '/new', label: t('Products'), icon: <Tag className="w-5 h-5" /> },
    { href: '/offers', label: t('Offers'), icon: <Tag className="w-5 h-5" /> },
    { href: '/about-us', label: t('AboutUs'), icon: <Info className="w-5 h-5" /> },
    { href: '/contact-us', label: t('ContactUs'), icon: <Mail className="w-5 h-5" /> },
  ]

  return (
    <>
      <header className="w-full font-sans">

        {/* ── Top info bar: lg+ only ──────────────────────────────────────── */}
        <div className="bg-slate-50 border-b border-border py-1 px-4 hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[13px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:location-on" className="w-4 h-4" />
              <span>{t('Location')}</span>
            </div>
            <div className="flex items-center gap-5" dir="ltr">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4" />
                <span>info@dneest.com</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* ── Desktop logo + search + actions: lg+ only ──────────────────── */}
        <div className="bg-white py-5 px-4 hidden lg:block sticky top-0 z-50 shadow-sm border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <Link href="/">
              <Image src={Logo} alt="Logo" width={200} height={200} />
            </Link>

            <div className="flex-1 max-w-2xl w-full">
              <div className="flex h-11 border-2 border-primary rounded-lg overflow-hidden group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="bg-primary px-4 flex items-center text-white cursor-pointer hover:bg-primary/95 transition border-r border-primary/20">
                  <span className="text-sm font-medium">{t('All')}</span>
                  <ChevronDown className="w-4 h-4 ms-2" />
                </div>
                <input
                  type="text"
                  placeholder={t('Search')}
                  className="flex-1 px-4 text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <button className="bg-primary px-6 flex items-center justify-center text-white hover:bg-primary/95 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <HeaderActions />
          </div>
        </div>


        <div className="bg-white px-4 py-3 hidden md:flex lg:hidden flex-col gap-3 z-50 shadow-sm border-b">
          <div className="flex items-center justify-between gap-3">
            <Link href="/">
              <Image src={Logo} alt="Logo" width={160} height={160} className="w-32 h-auto" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-3 flex md:hidden items-center justify-between gap-3 sticky top-0 z-50 shadow-sm border-b">
          <Link href="/">
            <Image src={Logo} alt="Logo" width={140} height={140} className="w-28 h-auto" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Sticky nav bar ─────────────────────────────────────────────── */}
        <div className="hidden lg:block bg-foreground px-4 sticky top-[88px] z-40 shadow-xl  border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden bg-primary h-[54px] px-5 flex items-center gap-2 text-white hover:brightness-105 transition font-black shadow-lg shadow-primary/20"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden  lg:flex bg-primary h-[54px] px-8 items-center gap-3 cursor-pointer hover:brightness-105 transition font-black text-white shadow-lg shadow-primary/20">
                <Menu className="w-5 h-5" />
                <span className="text-sm tracking-wide uppercase">{t('BrowseCategories')}</span>
              </div>

              <nav className="hidden lg:flex items-center mx-6 !mt-0 gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-5 py-3 text-[13px] font-bold text-slate-300 hover:text-primary transition-all rounded-md whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Phone: lg+ only */}
            <div className="hidden lg:flex items-center gap-3 text-slate-200 font-bold group cursor-pointer">
              <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
                <Phone className="w-4 h-4 text-primary group-hover:text-white" />
              </div>
              <span className="text-[15px] tracking-tight">00966551628281</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search overlay (mobile + tablet) ─────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative bg-white shadow-2xl px-4 pt-4 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-500">{t('Search')}</span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex h-12 border-2 border-primary rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <div className="bg-primary px-3 flex items-center text-white cursor-pointer hover:bg-primary/95 transition border-r border-primary/20">
                <span className="text-sm font-medium">{t('All')}</span>
                <ChevronDown className="w-4 h-4 ms-1" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('Search')}
                className="flex-1 px-4 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button className="bg-primary px-5 flex items-center justify-center text-white hover:bg-primary/95 transition">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
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
                {t('BrowseCategories')}
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

              <button className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors w-full text-start">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {t('Cart') ?? 'Cart'}
              </button>

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
                <span>info@dneest.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}