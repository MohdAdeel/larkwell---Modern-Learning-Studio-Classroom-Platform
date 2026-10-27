export const instant = false;

import type { Metadata } from "next";
import { StudentDashboard } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <StudentDashboard />
  );
}
