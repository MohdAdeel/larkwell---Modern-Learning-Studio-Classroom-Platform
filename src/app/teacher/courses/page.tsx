export const instant = false;

import type { Metadata } from "next";
import { CourseManager } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Courses" };

export default function Page() {
  return (
    <CourseManager />
  );
}
