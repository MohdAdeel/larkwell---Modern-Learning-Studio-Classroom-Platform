export const instant = false;

import type { Metadata } from "next";
import { StudentRoster } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Students" };

export default function Page() {
  return (
    <StudentRoster />
  );
}
