export const instant = false;

import type { Metadata } from "next";
import { AboutView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <AboutView />
  );
}
