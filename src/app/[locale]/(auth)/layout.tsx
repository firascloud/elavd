import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";

const AuthLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (token) {
    redirect({ href: "/admin", locale });
  }

  return (
    <>
      <div className="min-h-screen">{children}</div>
    </>
  );
};

export default AuthLayout;
