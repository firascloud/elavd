"use client";

import React from 'react';
import ContactList from './_components/ContactList';
import { useTranslations } from 'next-intl';

export default function ContactsPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <ContactList />
    </div>
  );
}
