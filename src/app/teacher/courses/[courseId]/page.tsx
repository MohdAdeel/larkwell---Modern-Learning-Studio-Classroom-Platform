export const instant = false;

import type { Metadata } from "next";
import { CourseBuilder } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Curriculum" };

export default function Page() {
  return (
    <CourseBuilder />
  );
}
