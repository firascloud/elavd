import React from 'react';
import UserList from './_components/UserList';
import { useTranslations } from 'next-intl';

export default function UsersPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black ltr:tracking-tight">{t("Users")}</h1>
        <p className="text-sm font-medium text-muted-foreground">{t("Manage platform administrators and users")}</p>
      </div>

      <UserList />
    </div>
  );
}

