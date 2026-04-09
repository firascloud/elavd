import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { contactMetadata } from "@/metadata/contact";
import { getContactJsonLd } from "@/seo/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return contactMetadata(locale);
}

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactJsonLd(locale)) }}
      />
      <ContactClient />
    </>
  );
}
