export const instant = false;

import type { Metadata } from "next";
import { LandingView } from "@/features/marketing/landing";

export const metadata: Metadata = {
  title: "A quieter studio for live teaching",
  description: "Larkwell brings live classes, a real whiteboard, and a shared library into one calm place.",
};

export default function HomePage() {
  return <LandingView />;
}
