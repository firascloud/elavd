import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";

const AuthLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const token = (await cookies()).get("access_token")?.value;
  const [commonMessages, authMessages] = await Promise.all([
    import(`../../../../messages/common/${locale}.json`).then((module) => module.default),
    import(`../../../../messages/auth/${locale}.json`).then((module) => module.default),
  ]);

  if (token) {
    redirect({ href: "/admin", locale });
  }

  return (
    <NextIntlClientProvider locale={locale} messages={{ ...commonMessages, ...authMessages }}>
      <div className="min-h-screen">{children}</div>
    </NextIntlClientProvider>
  );
};

export default AuthLayout;
