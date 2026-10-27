export const instant = false;

import type { Metadata } from "next";
import { StudentSettings } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <StudentSettings />
  );
}
