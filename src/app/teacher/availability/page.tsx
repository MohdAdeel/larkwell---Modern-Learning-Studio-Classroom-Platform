export const instant = false;

import type { Metadata } from "next";
import { AvailabilityEditor } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Availability" };

export default function Page() {
  return (
    <AvailabilityEditor />
  );
}
