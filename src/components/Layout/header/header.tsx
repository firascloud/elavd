'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Info, Mail, Home, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import { getCategories, type Category } from '@/services/categoryService'

// Sub-components
import TopInfoBar from './TopInfoBar'
import LogoSection from './LogoSection'
import DesktopNavbar from './DesktopNavbar'
import MobileHeader from './MobileHeader'
import SearchOverlay from './SearchOverlay'
import MobileMenuSidebar from './MobileMenuSidebar'

export function Header() {
  const t = useTranslations('common')
  const pathname = usePathname()

  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Smart sticky behavior logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        if (currentScrollY > 50) setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update CSS variable for header height to allow other components to sync
  useEffect(() => {
    const updateHeaderHeight = () => {
      const isDesktop = window.innerWidth >= 768
      let height = 0
      
      if (isDesktop) {
        height = isVisible ? 194 : 50
      } else {
        height = isVisible ? 64 : 0
      }
      
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [isVisible])

  // Initial data fetching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(10)
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
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
          <LogoSection setMenuOpen={setMenuOpen} setSearchOpen={setSearchOpen} />
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
      <SearchOverlay 
        searchOpen={searchOpen} 
        setSearchOpen={setSearchOpen} 
        searchInputRef={searchInputRef} 
      />
      <MobileMenuSidebar 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        navLinks={navLinks} 
        categories={categories} 
      />
    </>
  )
}