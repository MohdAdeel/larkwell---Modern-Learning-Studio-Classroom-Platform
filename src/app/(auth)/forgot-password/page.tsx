export const instant = false;

import type { Metadata } from "next";
import { ForgotView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Forgot password" };

export default function Page() {
  return (
    <ForgotView />
  );
}
