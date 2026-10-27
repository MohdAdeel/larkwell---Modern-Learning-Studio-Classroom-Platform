export const instant = false;

import type { Metadata } from "next";
import { AdminStudent } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Student" };

export default function Page() {
  return (
    <AdminStudent />
  );
}
