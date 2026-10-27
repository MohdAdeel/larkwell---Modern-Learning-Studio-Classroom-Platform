export const instant = false;

import type { Metadata } from "next";
import { AdminSettings } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <AdminSettings />
  );
}
