export const instant = false;

import type { Metadata } from "next";
import { ContactView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <ContactView />
  );
}
