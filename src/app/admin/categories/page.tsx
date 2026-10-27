export const instant = false;

import type { Metadata } from "next";
import { AdminCategories } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Subjects" };

export default function Page() {
  return (
    <AdminCategories />
  );
}
