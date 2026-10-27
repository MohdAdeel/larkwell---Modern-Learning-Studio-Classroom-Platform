export const instant = false;

import type { Metadata } from "next";
import { ClassForm } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "New class" };

export default function Page() {
  return (
    <ClassForm mode="new" />
  );
}
