import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { contactMetadata } from "@/metadata/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return contactMetadata(locale);
}

export default function ContactUsPage() {
  return <ContactClient />;
}
