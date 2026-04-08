'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function TopInfoBar() {
  const t = useTranslations('common')

  return (
    <div className="bg-slate-50 border-b border-border h-[38px] items-center px-4 hidden lg:flex">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full text-[13px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:location-on" className="w-4 h-4" />
          <span>{t('Location')}</span>
        </div>
        <div className="flex items-center gap-5" dir="ltr">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:email" className="w-4 h-4" />
            <span>sales@elavd.com</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
