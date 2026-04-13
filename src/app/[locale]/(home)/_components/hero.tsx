'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const autoplay = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: false }), [])
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    direction: isRtl ? 'rtl' : 'ltr'
  }, [autoplay])

  const slides = [
    { id: '1', image: require('@/assets/banner-3.svg') },
    { id: '2', image: require('@/assets/banner-1.svg') },
    { id: '3', image: require('@/assets/banner-2.svg') },
    { id: '4', image: require('@/assets/banner-4.svg') },
  ]

  return (
    <section className="bg-muted/30 py-6 px-4 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <div className="lg:col-span-3 md:flex flex-col gap-6 order-2 lg:order-1 hidden">
            <div className="flex-1 rounded-lg overflow-hidden relative group shadow-sm border border-border cursor-pointer min-h-[180px] hover:border-primary/30 transition-all">
              <Image
                src={require('@/assets/banner-1.svg')}
                alt="Hotel Safes"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 px-5">
                <span className="bg-background/90 text-foreground text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl inline-flex items-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xl backdrop-blur">
                  {t('HotelSafes')}
                  <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                </span>
              </div>
            </div>

            <div className="flex-1 rounded-lg overflow-hidden relative group shadow-sm border border-border cursor-pointer min-h-[180px] hover:border-primary/30 transition-all">
              <Image
                src={require('@/assets/banner-2.svg')}
                alt="Deposit Safes"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 px-5">
                <span className="bg-background/90 text-foreground text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl inline-flex items-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xl backdrop-blur">
                  {t('DepositSafes')}
                  <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 overflow-hidden rounded-lg bg-foreground shadow-2xl border border-primary-white/5 order-1 lg:order-2 perspective" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide) => (
                <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full min-h-[300px] lg:min-h-[460px] overflow-hidden group">

                    <Image
                    src={slide.image}
                    alt="Banner Background"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out"
                  />

                  <div className={`absolute inset-0 z-10 transition-opacity duration-1000 bg-gradient-to-b ${isRtl ? 'md:bg-gradient-to-l' : 'md:bg-gradient-to-r'} from-foreground via-foreground/85 md:via-foreground/70 to-transparent`} />

                  <div className="relative z-20 h-full p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px w-8 bg-secondary" />
                      <span className="text-secondary text-[10px] font-black tracking-[0.2em] uppercase">
                        {t(`Slides.${slide.id}.Tag`)}
                      </span>
                    </div>

                    <h1 className="text-[30px] md:text-[38px] lg:text-[46px] leading-[1.05] font-black text-primary-foreground mb-4 tracking-tight font-cairo max-w-2xl">
                      {t(`Slides.${slide.id}.Title`)}
                    </h1>

                    <p className="text-white text-sm md:text-base mb-6 max-w-md font-medium leading-relaxed line-clamp-2 lg:line-clamp-none">
                      {t(`Slides.${slide.id}.Desc`)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-8 max-w-lg">
                      {[1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="flex items-center gap-3 group/item">
                          <div className="size-5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center backdrop-blur-sm group-hover/item:border-secondary transition-colors">
                            <CheckCircle2 size={12} className="text-secondary" />
                          </div>
                          <span className="text-primary-foreground/70 text-[13px] font-semibold transition-colors group-hover/item:text-primary-foreground">
                            {t(`Slides.${slide.id}.Bullet${idx}`)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-5 mt-auto sm:mt-0">
                      <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-none group px-8 rounded-2xl transition-all shadow-2xl shadow-foreground/50 active:scale-95">
                        <span className="font-black text-[12px] tracking-wider uppercase">{t('MoreDetails')}</span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4 me-3 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 ms-3 group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-[11]" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-lg overflow-hidden relative shadow-sm border border-border min-h-[290px] order-3 group cursor-pointer hover:border-primary/30 transition-all hidden md:block">
            <Image
              src={require('@/assets/banner-3.svg')}
              alt="Card Printers"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-primary-foreground text-lg font-black tracking-tight font-cairo">{t('CardPrinters')}</h3>
                <p className="text-primary-foreground/70 text-[10px] leading-relaxed font-bold uppercase tracking-wide">{t('CardPrintersSubtitle')}</p>
              </div>
              <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl inline-flex items-center justify-center gap-3 hover:bg-primary/90 transition-all duration-300 shadow-xl">
                {t('Explore')}
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}