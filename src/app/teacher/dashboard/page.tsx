export const instant = false;

import type { Metadata } from "next";
import { TeacherDashboard } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <TeacherDashboard />
  );
}
