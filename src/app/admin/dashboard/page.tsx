export const instant = false;

import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <AdminDashboard />
  );
}
