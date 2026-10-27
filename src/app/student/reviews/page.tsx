export const instant = false;

import type { Metadata } from "next";
import { StudentReviews } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Reviews" };

export default function Page() {
  return (
    <StudentReviews />
  );
}
