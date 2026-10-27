export const instant = false;

import type { Metadata } from "next";
import { AdminTeachers } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Teachers" };

export default function Page() {
  return (
    <AdminTeachers />
  );
}
