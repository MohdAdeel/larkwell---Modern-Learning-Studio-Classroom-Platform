export const instant = false;

import type { Metadata } from "next";
import { HelpView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Help" };

export default function Page() {
  return (
    <HelpView />
  );
}
