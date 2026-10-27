export const instant = false;

import type { Metadata } from "next";
import { StudentCourse } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Course" };

export default function Page() {
  return (
    <StudentCourse />
  );
}
