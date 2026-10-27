export const instant = false;

import type { Metadata } from "next";
import { AdminCourses } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Courses" };

export default function Page() {
  return (
    <AdminCourses />
  );
}
