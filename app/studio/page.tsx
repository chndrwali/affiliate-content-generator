import type { Metadata } from "next";
import { StudioPage } from "@/modules/studio/ui/studio-page";

export const metadata: Metadata = {
  title: "Studio — Affiliate Content Generator",
  description:
    "Rakit prompt terstruktur untuk konten afiliasi: riset produk, konsep, skrip final, dan shooting plan — untuk dipakai di ChatGPT.",
};

export default function StudioRoutePage() {
  return <StudioPage />;
}
