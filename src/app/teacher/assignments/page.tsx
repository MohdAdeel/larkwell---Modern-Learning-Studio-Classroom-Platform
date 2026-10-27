export const instant = false;

import type { Metadata } from "next";
import { AssignmentDesk } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Assignments" };

export default function Page() {
  return (
    <AssignmentDesk />
  );
}
