export const instant = false;

import type { Metadata } from "next";
import { ClassForm } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Class" };

export default function Page() {
  return (
    <ClassForm mode="edit" />
  );
}
