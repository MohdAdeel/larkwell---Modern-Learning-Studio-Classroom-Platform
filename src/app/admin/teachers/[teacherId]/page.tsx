export const instant = false;

import type { Metadata } from "next";
import { AdminTeacher } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Teacher" };

export default function Page() {
  return (
    <AdminTeacher />
  );
}
