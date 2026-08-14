import React from 'react';
import UserList from './_components/UserList';
import { useTranslations } from 'next-intl';
import { UsersRound } from 'lucide-react';

export default function UsersPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.07] px-5 py-5 shadow-sm sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute -end-14 -top-16 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-background/70 px-3 py-1 text-[11px] font-bold text-secondary shadow-sm backdrop-blur">
            <UsersRound className="h-3.5 w-3.5" />
            {t("Overview")}
          </div>
          <h1 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">{t("Users")}</h1>
          <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            {t("Manage platform administrators and users")}
          </p>
        </div>
      </section>

      <UserList />
    </div>
  );
}

