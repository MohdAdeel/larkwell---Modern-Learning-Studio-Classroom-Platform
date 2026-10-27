export const instant = false;

import type { Metadata } from "next";
import { StudentSummary } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Student" };

export default function Page() {
  return (
    <StudentSummary />
  );
}
