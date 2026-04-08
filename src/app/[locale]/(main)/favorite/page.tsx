import type { Metadata } from "next";
import FavoriteClient from "./FavoriteClient";
import { favoriteMetadata } from "@/metadata/favorite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return favoriteMetadata(locale);
}

export default function FavoritePage() {
  return <FavoriteClient />;
}
