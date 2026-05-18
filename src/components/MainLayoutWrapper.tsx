"use client";

import { usePathname } from "@/i18n/routing";
import { Header } from "@/components/Layout/header/header";
import { Footer } from "@/components/Layout/footer/footer";
import FloatingActions from "@/components/FloatingActions";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

 
  const isDashboard = pathname.includes("/admin");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="outline-none">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
