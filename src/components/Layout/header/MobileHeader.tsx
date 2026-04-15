'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Search, Menu } from 'lucide-react'
import Logo from '@/assets/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'

interface MobileHeaderProps {
  isVisible: boolean
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
}

export default function MobileHeader({ isVisible, setSearchOpen, setMenuOpen }: MobileHeaderProps) {
  return (
    <div className={`bg-white p-4 flex md:hidden items-center justify-between gap-3 fixed top-0 left-0 w-full z-50 shadow-sm border-b transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <Link href="/">
        <Image src={Logo} alt="Elavd Security Systems Logo" width={140} height={140} className="w-28 h-auto" />
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
  )
}
