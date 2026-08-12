'use client'

import React from 'react'
import { MapPin, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function TopInfoBar() {
  const t = useTranslations('common')

  return (
    <div className="bg-slate-50 border-b border-border h-[38px] items-center px-4 hidden lg:flex">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full text-[13px] text-muted-foreground">
        <a
          href="https://maps.app.goo.gl/HNuVCYKNmeE8fpNJ6"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-primary"
          aria-label={`${t('Location')} (Google Maps)`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('Location')}</span>
        </a>
        <div className="flex items-center gap-5" dir="ltr">
          <a
            href="mailto:sales@elavd.com"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Mail className="w-4 h-4" />
            <span>sales@elavd.com</span>
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
