export const instant = false;

import type { Metadata } from "next";
import { AdminBilling } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Billing" };

export default function Page() {
  return (
    <AdminBilling />
  );
}
