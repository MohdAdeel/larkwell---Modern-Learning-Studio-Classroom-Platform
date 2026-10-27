export const instant = false;

import type { Metadata } from "next";
import { StudentAssignments } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Assignments" };

export default function Page() {
  return (
    <StudentAssignments />
  );
}
