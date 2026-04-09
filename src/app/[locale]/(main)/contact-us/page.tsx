import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { contactMetadata } from "@/metadata/contact";
import { getContactJsonLd } from "@/seo/contact";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return contactMetadata(locale);
}

export default async function ContactUsPage() {
  // getLocale() reads the locale from next-intl middleware — works correctly
  // with localePrefix:'never' where params[locale] may not be in the URL
  const locale = await getLocale();
  return (
    <>
      {/* Inline JSON-LD — server-rendered so Googlebot sees it in initial HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactJsonLd(locale)) }}
      />
      <ContactClient />
    </>
  );
}
