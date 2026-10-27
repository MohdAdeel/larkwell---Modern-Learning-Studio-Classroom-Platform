export const instant = false;

import type { Metadata } from "next";
import { LegalView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return (
    <LegalView kind="terms" />
  );
}
