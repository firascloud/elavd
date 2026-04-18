'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const isRtl = locale === 'ar'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (isRtl) {
          const isAtStart = scrollLeft >= -5;
          const isAtEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 5;
          setShowLeftArrow(!isAtEnd);
          setShowRightArrow(!isAtStart);
        } else {
          const isAtStart = scrollLeft <= 5;
          const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;
          setShowLeftArrow(!isAtStart);
          setShowRightArrow(!isAtEnd);
        }
      });
    }
  }

  useEffect(() => {
    checkScroll();
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScroll, 100);
    };

    window.addEventListener('resize', handleResize);
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScroll);
      }
    }
  }, [navLinks, categories, isRtl]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      const amount = direction === 'left' ? -scrollAmount : scrollAmount

      scrollRef.current.scrollBy({
        left: amount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-white px-4 shadow-md border-t border-white/5 h-[50px] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex-1 overflow-hidden relative group navbar-scroll-container">

          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className={cn(
                "absolute z-10 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white shadow-lg border border-gray-100 rounded-full text-gray-600 hover:text-primary transition-all active:scale-90",
                isRtl ? "right-1" : "left-1"
              )}
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            <nav className="flex items-center gap-1 flex-nowrap min-w-full">
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

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className={cn(
                "absolute z-10 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white shadow-lg border border-gray-100 rounded-full text-gray-600 hover:text-primary transition-all active:scale-90",
                isRtl ? "left-1" : "right-1"
              )}
            >
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}

          {/* Fade indicators for smoother transition */}
          <div className={cn(
            "absolute top-0 bottom-0 w-16 pointer-events-none transition-opacity duration-300",
            isRtl ? "right-0 bg-gradient-to-l from-white to-transparent" : "left-0 bg-gradient-to-r from-white to-transparent",
            showLeftArrow ? "opacity-100" : "opacity-0"
          )} />
          <div className={cn(
            "absolute top-0 bottom-0 w-16 pointer-events-none transition-opacity duration-300",
            isRtl ? "left-0 bg-gradient-to-r from-white to-transparent" : "right-0 bg-gradient-to-l from-white to-transparent",
            showRightArrow ? "opacity-100" : "opacity-0"
          )} />
        </div>

        {/* Phone: lg+ only */}
        <div className="hidden lg:flex items-center gap-3 text-[#1a1a1a] font-bold group cursor-pointer shrink-0 ps-4">
          <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
            <Phone className="w-4 h-4 text-primary group-hover:text-white" />
          </div>
          <a href="tel:0553202091" className="text-[14px] ltr:tracking-tight hover:text-primary transition-colors">0553202091</a>
          <span className="text-gray-300">-</span>
          <a href="tel:0556482799" className="text-[14px] ltr:tracking-tight hover:text-primary transition-colors">0556482799</a>
        </div>
      </div>
    </div>
  )
}
