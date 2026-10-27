export const instant = false;

import type { Metadata } from "next";
import { CourseDetail } from "@/features/courses/course-detail";

export const metadata: Metadata = { title: "Course" };

export default function Page() {
  return (
    <CourseDetail />
  );
}
