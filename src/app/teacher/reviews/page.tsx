export const instant = false;

import type { Metadata } from "next";
import { TeacherReviews } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Reviews" };

export default function Page() {
  return (
    <TeacherReviews />
  );
}
