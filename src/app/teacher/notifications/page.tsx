export const instant = false;

import type { Metadata } from "next";
import { SessionNotices } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return (
    <SessionNotices />
  );
}
