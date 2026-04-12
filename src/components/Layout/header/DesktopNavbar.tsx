'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { Phone } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Category } from '@/services/categoryService'

interface NavLink {
  href: string
  label: string
}

interface DesktopNavbarProps {
  navLinks: NavLink[]
  categories: Category[]
  activePathname: string
}

export default function DesktopNavbar({ navLinks, categories, activePathname }: DesktopNavbarProps) {
  const locale = useLocale()

  return (
    <div className="bg-white px-4 shadow-md border-t border-white/5 h-[50px] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex-1 overflow-hidden relative group">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            <nav className="flex items-center gap-1 flex-nowrap">
              {navLinks.map(link => {
                const isActive = activePathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-[13px] font-bold transition-all rounded-full whitespace-nowrap",
                      isActive
                        ? " text-primary scale-105"
                        : "text-[#1a1a1a] hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Separator if both exist */}
              {navLinks.length > 0 && categories.length > 0 && (
                <div className="h-4 w-px bg-gray-200 mx-2 shrink-0" />
              )}

              {categories.map(cat => {
                const categoryPath = `/product-category/${cat.slug_en}`
                const isActive = activePathname === categoryPath || activePathname.includes(cat.slug_en || '')
                return (
                  <Link
                    key={cat.id}
                    href={categoryPath}
                    className={cn(
                      "px-4 py-2 text-[13px] font-bold transition-all rounded-full whitespace-nowrap",
                      isActive
                        ? " text-primary"
                        : "text-[#1a1a1a] hover:text-primary"
                    )}
                  >
                    {locale === 'ar' ? cat.name_ar : cat.name_en}
                  </Link>
                )
              })}
            </nav>
          </div>
          {/* Subtle fade indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Phone: lg+ only */}
        <div className="hidden lg:flex items-center gap-3 text-[#1a1a1a] font-bold group cursor-pointer shrink-0 ps-4">
          <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
            <Phone className="w-4 h-4 text-primary group-hover:text-white" />
          </div>
          <a href="tel:0553202091" className="text-[14px] tracking-tight hover:text-primary transition-colors">0553202091</a>
          <span className="text-gray-300">-</span>
          <a href="tel:0556482799" className="text-[14px] tracking-tight hover:text-primary transition-colors">0556482799</a>
        </div>
      </div>
    </div>
  )
}
