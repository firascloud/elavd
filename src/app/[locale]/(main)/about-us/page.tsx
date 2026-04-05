"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Target, Eye, ShieldCheck, Trophy, Info, Users, Briefcase, Zap, Star } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';

export default function AboutUsPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const stats = [
    { icon: <Users size={24} />, label: t('stats.clients'), value: '500+' },
    { icon: <Briefcase size={24} />, label: t('stats.projects'), value: '1,200+' },
    { icon: <Star size={24} />, label: t('stats.awards'), value: '15+' },
    { icon: <Trophy size={24} />, label: t('stats.experience'), value: '10+' },
  ];

  const whyChooseUs = [
    { 
        title: t('whyChooseUs.item1Title'), 
        desc: t('whyChooseUs.item1Desc'), 
        icon: <Zap className="text-orange-500" size={28} /> 
    },
    { 
        title: t('whyChooseUs.item2Title'), 
        desc: t('whyChooseUs.item2Desc'), 
        icon: <Users className="text-orange-500" size={28} /> 
    },
    { 
        title: t('whyChooseUs.item3Title'), 
        desc: t('whyChooseUs.item3Desc'), 
        icon: <ShieldCheck className="text-orange-500" size={28} /> 
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 overflow-hidden">
      <PageHeader 
        title={t('title')} 
        subtitle={t('subtitle')}
        icon={<Info size={28} />}
      />

      <div className="max-w-7xl mx-auto px-4 mt-16 lg:mt-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
          <div className="relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-100">
            <Image 
                src={require('@/assets/banner-1.png')} 
                alt="About DUBAI NETWORK IT EST" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 inset-x-8">
               <h3 className="text-white text-xl font-bold font-cairo">
                  {locale === 'ar' ? 'مؤسسة رائدة في تقنية المعلومات' : 'Leading IT Establishment'}
               </h3>
               <p className="text-white/70 text-xs font-medium mt-1 uppercase tracking-widest">
                  Serving Saudi Arabia since 2014
               </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f38d38]/10 text-[#f38d38] rounded-full text-[10px] font-black uppercase tracking-widest">
                    <span className="size-1.5 bg-[#f38d38] rounded-full animate-pulse" />
                    Our Story
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-[#1a1a1a] font-cairo leading-tight">
                    {t('subtitle')}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed font-bold border-l-4 border-[#f38d38] pl-5 rtl:border-l-0 rtl:border-r-4 rtl:pr-5 rtl:pl-0 font-cairo">
                    {t('desc1')}
                </p>
                <p className="text-gray-400 text-sm leading-7 font-medium">
                    {t('desc2')}
                </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex-1 min-w-[140px] p-5 bg-gray-50 rounded-2xl space-y-2 border border-gray-100 group">
                    <Target className="text-[#f38d38] size-6 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-gray-900 text-sm font-cairo">{t('mission')}</h4>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{t('missionDesc')}</p>
                </div>
                <div className="flex-1 min-w-[140px] p-5 bg-gray-50 rounded-2xl space-y-2 border border-gray-100 group">
                    <Eye className="text-[#f38d38] size-6 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-gray-900 text-sm font-cairo">{t('vision')}</h4>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{t('visionDesc')}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24 lg:mb-32">
            {stats.map((stat, i) => (
                <div key={i} className="p-8 bg-white border border-gray-100 rounded-[1.5rem] text-center shadow-sm hover:shadow-xl hover:shadow-gray-50 transition-all group">
                    <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#f38d38] group-hover:bg-[#f38d38] group-hover:text-white transition-all">
                        {stat.icon}
                    </div>
                    <div className="text-2xl font-black text-gray-900 font-inter mb-1">
                        {stat.value}
                    </div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="relative bg-[#1a1a1a] rounded-[3rem] p-10 lg:p-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f38d38]/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-4 space-y-6">
                    <div className="text-[#f38d38] text-[10px] font-black tracking-[0.2em] uppercase">
                        Benefits
                    </div>
                    <h2 className="text-3xl text-white font-black font-cairo leading-tight">
                        {t('whyChooseUs.title')}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        {t('whyChooseUs.subtitle')}
                    </p>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {whyChooseUs.map((item, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-4 hover:bg-white/10 transition-colors group">
                            <div className="size-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-black text-lg font-cairo">{item.title}</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
