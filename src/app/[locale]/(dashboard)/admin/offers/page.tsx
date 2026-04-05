import React from 'react';
import OfferList from './_components/OfferList';
import { useTranslations } from 'next-intl';

export default function OffersPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground">{t("Offers")}</h1>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {t("OffersDescription")}
        </p>
      </div>

      <OfferList />
    </div>
  );
}

