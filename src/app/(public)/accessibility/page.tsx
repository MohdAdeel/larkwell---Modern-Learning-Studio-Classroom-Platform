export const instant = false;

import type { Metadata } from "next";
import { LegalView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Accessibility" };

export default function Page() {
  return (
    <LegalView kind="accessibility" />
  );
}
