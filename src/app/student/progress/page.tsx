export const instant = false;

import type { Metadata } from "next";
import { ProgressView } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Progress" };

export default function Page() {
  return (
    <ProgressView />
  );
}
