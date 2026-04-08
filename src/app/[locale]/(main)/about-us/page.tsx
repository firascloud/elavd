import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { aboutMetadata } from "@/metadata/about";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return aboutMetadata(locale);
}

export default function AboutUsPage() {
    return <AboutClient />;
}
