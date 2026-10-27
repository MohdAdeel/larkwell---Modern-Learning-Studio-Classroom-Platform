export const instant = false;

import type { Metadata } from "next";
import { TeacherDirectory } from "@/features/teachers/teacher-views";

export const metadata: Metadata = { title: "Teachers" };

export default function Page() {
  return (
    <TeacherDirectory />
  );
}
