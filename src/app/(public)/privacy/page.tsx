export const instant = false;

import type { Metadata } from "next";
import { LegalView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return (
    <LegalView kind="privacy" />
  );
}
