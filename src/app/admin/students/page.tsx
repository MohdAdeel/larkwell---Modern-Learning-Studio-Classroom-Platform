export const instant = false;

import type { Metadata } from "next";
import { AdminStudents } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Students" };

export default function Page() {
  return (
    <AdminStudents />
  );
}
