export const instant = false;

import type { Metadata } from "next";
import { ClassSchedule } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Schedule" };

export default function Page() {
  return (
    <ClassSchedule />
  );
}
