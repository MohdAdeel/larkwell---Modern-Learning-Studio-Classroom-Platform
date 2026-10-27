export const instant = false;

import type { Metadata } from "next";
import { PricingView } from "@/features/billing/billing-views";

export const metadata: Metadata = { title: "Pricing" };

export default function Page() {
  return (
    <PricingView />
  );
}
