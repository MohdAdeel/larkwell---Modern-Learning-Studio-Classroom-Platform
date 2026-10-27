export const instant = false;

import type { Metadata } from "next";
import { NewCourse } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "New course" };

export default function Page() {
  return (
    <NewCourse />
  );
}
