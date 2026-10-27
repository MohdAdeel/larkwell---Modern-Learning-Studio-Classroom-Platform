export const instant = false;

import type { Metadata } from "next";
import { TeacherProfile } from "@/features/teachers/teacher-views";

export const metadata: Metadata = { title: "Teacher" };

export default function Page() {
  return (
    <TeacherProfile />
  );
}
