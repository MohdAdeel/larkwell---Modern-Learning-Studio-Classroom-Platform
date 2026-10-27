export const instant = false;

import type { Metadata } from "next";
import { AdminContent } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Content" };

export default function Page() {
  return (
    <AdminContent />
  );
}
