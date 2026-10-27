export const instant = false;

import type { Metadata } from "next";
import { AdminSupport } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Support" };

export default function Page() {
  return (
    <AdminSupport />
  );
}
