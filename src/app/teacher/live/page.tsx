export const instant = false;

import type { Metadata } from "next";
import { LiveSessions } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Live sessions" };

export default function Page() {
  return (
    <LiveSessions />
  );
}
