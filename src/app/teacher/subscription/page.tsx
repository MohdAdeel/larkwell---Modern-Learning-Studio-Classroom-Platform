export const instant = false;

import type { Metadata } from "next";
import { MembershipView } from "@/features/billing/billing-views";

export const metadata: Metadata = { title: "Plan" };

export default function Page() {
  return (
    <MembershipView audience="teacher" />
  );
}
