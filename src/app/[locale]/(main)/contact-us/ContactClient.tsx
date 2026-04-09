"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';

export default function ContactClient() {
  const t = useTranslations('contact');
  const common = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const contactInfo = [
    {
      icon: <MapPin className="size-6 text-primary" />,
      title: t('address'),
      content: common('Address'),
    },
    {
      icon: <Mail className="size-6 text-primary" />,
      title: t('email'),
      content: "sales@elavd.com",
    },
    {
      icon: <Phone className="size-6 text-primary" />,
      title: t('phoneLabel'),
      content: "0553202091",
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Phone size={28} />}
      />

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {contactInfo.map((info, idx) => (
            <div
              key={idx}
              className="bg-background border border-border rounded-[1.5rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-muted/50 transition-all group"
            >
              <div className="size-15 bg-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {info.icon}
              </div>
              <h3 className="text-lg font-black text-foreground mb-2 font-cairo">
                {info.title}
              </h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed font-bold max-w-[180px]">
                {info.content}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-muted/30 border border-border rounded-[2rem] p-10 flex flex-col items-center text-center justify-center space-y-8 group">
            <div className="relative w-full max-w-[220px] h-28 transform transition-transform group-hover:scale-105 duration-700">
              <Image
                src={require('@/assets/logo.svg')}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground font-cairo leading-tight">
                {t('speedSecurity')}
              </h2>
              <p className="text-muted-foreground text-sm leading-7 font-medium px-4">
                {t('description')}
              </p>
            </div>

            <button className="px-10 py-3.5  cursor-pointer bg-primary text-primary-foreground font-black text-sm rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 active:scale-95 uppercase tracking-widest">
              {t('discoverMore')}
            </button>
          </div>

          <div className="lg:col-span-7 bg-background border border-border rounded-[2rem] p-8 lg:p-12 shadow-2xl shadow-muted/50">
            <div className="flex items-center gap-4 mb-8 border-b border-border pb-6 group">
              <div className="size-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-foreground font-cairo">
                  {t('title')}
                </h3>
                <p className="text-muted-foreground text-xs font-medium">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <form className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                    {t('name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={t('name')}
                    className="w-full h-12 bg-muted/50 border border-border rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-phone" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                    {t('phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder={t('phone')}
                    className="w-full h-12 bg-muted/50 border border-border rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                  {t('message')}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder={t('placeholder')}
                  className="w-full bg-muted/50 border border-border rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button className="flex cursor-pointer items-center gap-3 px-12 py-3.5 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/10 active:scale-95 group uppercase tracking-widest text-sm">
                  <Send size={18} className="group-hover:-translate-y-1 transition-transform" />
                  <span>{t('send')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

