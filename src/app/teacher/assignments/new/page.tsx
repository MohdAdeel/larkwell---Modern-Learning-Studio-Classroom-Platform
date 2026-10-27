export const instant = false;

import type { Metadata } from "next";
import { NewAssignment } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "New assignment" };

export default function Page() {
  return (
    <NewAssignment />
  );
}
