import React from 'react';
import OfferList from './_components/OfferList';
import { useTranslations } from 'next-intl';

export default function OffersPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6 pb-20">
      <OfferList />
    </div>
  );
}

