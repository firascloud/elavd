'use client'

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Info, Mail, Home, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import type { Category } from '@/services/categoryService'

// Sub-components
import TopInfoBar from './TopInfoBar'
import LogoSection from './LogoSection'
import DesktopNavbar from './DesktopNavbar'
import MobileHeader from './MobileHeader'
const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false })
const MobileMenuSidebar = dynamic(() => import('./MobileMenuSidebar'), { ssr: false })

export function Header({ categories }: { categories: Category[] }) {
  const t = useTranslations('common')
  const pathname = usePathname()

  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const visibilityRef = useRef(true)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Smart sticky behavior logic
  useEffect(() => {
    let frameId: number | null = null

    const handleScroll = () => {
      if (frameId !== null) return

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const nextVisibility = currentScrollY < 10
          ? true
          : currentScrollY > lastScrollY.current && currentScrollY > 50
            ? false
            : true

        if (nextVisibility !== visibilityRef.current) {
          visibilityRef.current = nextVisibility
          setIsVisible(nextVisibility)
        }

        lastScrollY.current = currentScrollY
        frameId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  // Close overlays on navigation
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: t('Home'), icon: <Home className="w-5 h-5" /> },
    { href: '/brands', label: t('Brands'), icon: <Tag className="w-5 h-5" /> },
    { href: '/about-us', label: t('AboutUs'), icon: <Info className="w-5 h-5" /> },
    { href: '/contact-us', label: t('ContactUs'), icon: <Mail className="w-5 h-5" /> },
  ]

  return (
    <>
      <header className="w-full font-sans">
        
        {/* ── Desktop/Tablet Section ───────────────────────────────────── */}
        <div 
          className="hidden md:block fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out bg-white shadow-sm"
          style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-144px)' }}
        >
          <TopInfoBar />
          <LogoSection categories={categories} setMenuOpen={setMenuOpen} setSearchOpen={setSearchOpen} />
          <DesktopNavbar navLinks={navLinks} categories={categories} activePathname={pathname} />
        </div>
        <div className="hidden md:block h-[194px]" />

        {/* ── Mobile Section ───────────────────────────────────────────── */}
        <MobileHeader 
          isVisible={isVisible} 
          setMenuOpen={setMenuOpen} 
          setSearchOpen={setSearchOpen} 
        />
        <div className="md:hidden h-16" />
      </header>

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      {searchOpen && (
        <SearchOverlay
          searchOpen
          setSearchOpen={setSearchOpen}
          searchInputRef={searchInputRef}
          categories={categories}
        />
      )}
      {menuOpen && (
        <MobileMenuSidebar
          menuOpen
          setMenuOpen={setMenuOpen}
          navLinks={navLinks}
          categories={categories}
        />
      )}
    </>
  )
}
