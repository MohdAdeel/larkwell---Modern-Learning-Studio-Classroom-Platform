export const instant = false;

import type { Metadata } from "next";
import { TeacherSettings } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <TeacherSettings />
  );
}
