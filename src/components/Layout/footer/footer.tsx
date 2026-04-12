'use client'

import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Logo from '@/assets/logo.svg'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  return (
    <footer className={`bg-[#fbf4f4] text-[#3a3a3a] border-t border-[#dccfcf]  ${isRtl ? 'font-el-messiri' : 'font-inter'}`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 flex flex-col ">
            <div className="mb-6 relative w-56 h-16 md:w-64 md:h-20 lg:w-72 lg:h-24">
              <Image
                src={Logo}
                alt="DUBAI NETWORK IT EST"
                width={600}
                height={400}
                className="object-contain rtl:object-right ltr:object-left drop-shadow-sm"
              />
            </div>
            <p className="text-[14px] leading-relaxed opacity-90 rtl:text-right ltr:text-left max-w-sm">
              {t('Description')}
            </p>
          </div>

          <div className="lg:col-span-3 flex flex-col ">
            <h3 className="text-xl font-bold mb-8 relative after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:left-0 after:w-8 after:h-[3px] after:bg-primary rounded-full">
              {t('Information')}
            </h3>
            <ul className="flex flex-col gap-6 text-[15px] font-medium">
              <li>
                <Link href="/delivery-information" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('DeliveryInformation')}</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('PrivacyPolicy')}</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('RefundPolicy')}</span>
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('Partnerships')}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('ContactTitle')}</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2 flex flex-col ">
            <h3 className="text-xl font-bold mb-8 relative after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:left-0 after:w-8 after:h-[3px] after:bg-primary rounded-full">
              {t('Extras')}
            </h3>
            <ul className="flex flex-col gap-6 text-[15px] font-medium">
              <li>
                <Link href="/brands" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('Brands')}</span>
                </Link>
              </li>
              <li>
                <Link href="/specials" className="flex items-center gap-2 hover:text-primary transition group">
                  {isRtl ? (
                    <Icon icon="mdi:chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>{t('Specials')}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col ">
            <h3 className="text-xl font-bold mb-8 relative after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:left-0 after:w-8 after:h-[3px] after:bg-primary rounded-full">
              {t('ContactTitle')}
            </h3>
            <ul className="space-y-5 text-[14px]">
              <li className="flex items-center gap-3 group">
                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                </div>
                <div className="flex flex-col  gap-1.5">
                  <span className="font-bold opacity-70">{t('PhoneLabel')}</span>
                  <div className="flex items-center gap-2">
                    <a href="tel:0553202091" className="hover:text-primary transition font-bold">0553202091</a>
                    <span className="text-gray-300">-</span>
                    <a href="tel:0556482799" className="hover:text-primary transition font-bold">0556482799</a>
                  </div>
                </div>
              </li>

              <li className="flex items-center gap-3 group">
                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Icon icon="mdi:email" className="w-4 h-4" />
                </div>
                <div className="flex flex-col  gap-1.5">
                  <span className="font-bold opacity-70">{t('EmailLabel')}</span>
                  <a href="mailto:sales@elavd.com" className="hover:text-primary transition">sales@elavd.com</a>
                </div>
              </li>
              <li className="flex  items-center  gap-3 group">
                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm mt-1">
                  <Icon icon="mdi:map-marker" className="w-4 h-4" />
                </div>
                <div className="flex flex-col  gap-1">
                  <span className="font-bold opacity-70">{t('LocationLabel')}</span>
                  <Link href="https://maps.app.goo.gl/HNuVCYKNmeE8fpNJ6" target="_blank">


                    <span className="opacity-90">{t('Address')}</span>
                  </Link>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-[#dcd8cf] bg-[#f5f1ea]/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
          <p className="text-[13px] text-gray-500 font-medium">
            {t('Copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
