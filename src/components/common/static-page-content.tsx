"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/common/page-header';
import { Info } from 'lucide-react';

interface StaticPageContentProps {
    pageKey: 'Partnerships' | 'RefundPolicy' | 'PrivacyPolicy' | 'DeliveryInformation';
}

export default function StaticPageContent({ pageKey }: StaticPageContentProps) {
  const t = useTranslations('info.' + pageKey);

  return (
    <div className="min-h-screen bg-[#fcf9f9] pb-20">
      <PageHeader
        title={t('Title')}
        icon={<Info size={28} />}
      />

      <div className="max-w-4xl mx-auto px-4 mt-16">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#eee1e1] shadow-sm shadow-black/5">
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1b] mb-8 font-cairo border-b-4 border-primary w-fit pb-2 rounded-sm">
                {t('Title')}
            </h2>
            <div className="text-[#4a4a4a] leading-relaxed whitespace-pre-line text-base md:text-lg font-medium font-cairo">
                {t('Content')}
            </div>
          </div>
      </div>
    </div>
  );
}
