import type { Metadata } from "next";
import CartClient from "./CartClient";
import { cartMetadata } from "@/metadata/cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cartMetadata(locale);
}

export default function CartPage() {
  return <CartClient />;
}
