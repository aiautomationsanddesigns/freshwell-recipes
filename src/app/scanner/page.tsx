import type { Metadata } from "next";
import { ScannerPageClient } from "./ScannerPageClient";

export const metadata: Metadata = {
  title: "Fridge Scanner | Freshwell",
  description: "Take a photo of your fridge and get AI-powered recipe suggestions based on what you have.",
};

export default function ScannerPage() {
  return <ScannerPageClient />;
}
