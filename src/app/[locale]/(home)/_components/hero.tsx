'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  return (
    <section className="bg-slate-50 py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
            <div className="flex-1 rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100 cursor-pointer min-h-[220px] hover:border-primary/30 transition-all">
              <Image
                src={require('@/assets/banner-1.png')}
                alt="Hotel Safes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 px-5">
                <span className="bg-foreground/90 text-background text-[12px] font-black uppercase tracking-widest px-5 py-3 rounded-xl inline-flex items-center gap-3 group-hover:bg-foreground transition-all duration-300 shadow-xl backdrop-blur">
                  {t('HotelSafes')}
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                </span>
              </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100 cursor-pointer min-h-[220px] hover:border-primary/30 transition-all">
              <Image
                src={require('@/assets/banner-2.png')}
                alt="Deposit Safes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 px-5">
                <span className="bg-foreground/90 text-background text-[12px] font-black uppercase tracking-widest px-5 py-3 rounded-xl inline-flex items-center gap-3 group-hover:bg-foreground transition-all duration-300 shadow-xl backdrop-blur">
                  {t('DepositSafes')}
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl p-10 shadow-sm border border-slate-100 flex flex-col justify-center order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[12px] font-black tracking-widest">
                {t('Tag')}
              </span>
            </div>
            <h1 className="text-[36px] md:text-[48px] leading-tight font-black text-foreground mb-4 tracking-tight">
              {t('Title')}
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 text-[14px] md:text-[15px] mb-7">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{t('Bullet1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{t('Bullet2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{t('Bullet3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{t('Bullet4')}</span>
              </li>
              <li className="flex items-start gap-2 sm:col-span-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{t('Bullet5')}</span>
              </li>
            </ul>
            <div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none group px-8 py-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
                <span className="font-bold">{t('MoreDetails')}</span>
                {isRtl ? (
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <span className="w-6 h-2 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100 min-h-[320px] order-3">
            <Image
              src={require('@/assets/bannner-3.png')}
              alt="Card Printers"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex rtl:items-start ltr:items-start flex-col gap-2">
                <div className="space-y-1">
                  <h3 className="text-white text-lg sm:text-xl font-extrabold tracking-tight">{t('CardPrinters')}</h3>
                  <p className="text-white/80 text-xs sm:text-sm">{t('CardPrintersSubtitle')}</p>
                </div>
                <span className="bg-white/90 text-foreground text-[12px] font-black uppercase tracking-widest px-5 py-3 rounded-xl inline-flex items-center gap-3 hover:bg-white transition-all duration-300 shadow-xl backdrop-blur">
                  {t('Explore')}
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}