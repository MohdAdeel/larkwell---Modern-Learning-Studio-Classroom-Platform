export const instant = false;

import type { Metadata } from "next";
import { ReviewAssignment } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Review assignment" };

export default function Page() {
  return (
    <ReviewAssignment />
  );
}
