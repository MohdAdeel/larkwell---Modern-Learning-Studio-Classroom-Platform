export const instant = false;

import type { Metadata } from "next";
import { ProfileEditor } from "@/features/teaching/teaching-views";

export const metadata: Metadata = { title: "Public profile" };

export default function Page() {
  return (
    <ProfileEditor />
  );
}
