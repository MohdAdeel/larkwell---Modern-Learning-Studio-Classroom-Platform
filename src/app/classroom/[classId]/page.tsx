export const instant = false;

import type { Metadata } from "next";
import { ClassroomView } from "@/features/classroom/classroom-view";

export const metadata: Metadata = { title: "Classroom" };

export default function Page() {
  return (
    <ClassroomView />
  );
}
