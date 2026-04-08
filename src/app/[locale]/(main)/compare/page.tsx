import type { Metadata } from "next";
import CompareClient from "./CompareClient";
import { compareMetadata } from "@/metadata/compare";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return compareMetadata(locale);
}

export default function ComparePage() {
  return <CompareClient />;
}
