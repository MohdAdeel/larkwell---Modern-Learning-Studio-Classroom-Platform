export const instant = false;

import type { Metadata } from "next";
import { ResetView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Reset password" };

export default function Page() {
  return (
    <ResetView />
  );
}
