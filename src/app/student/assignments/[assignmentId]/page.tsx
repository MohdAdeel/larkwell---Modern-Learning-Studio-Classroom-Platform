export const instant = false;

import type { Metadata } from "next";
import { StudentAssignment } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Assignment" };

export default function Page() {
  return (
    <StudentAssignment />
  );
}
