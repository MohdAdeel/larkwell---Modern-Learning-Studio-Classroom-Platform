export const instant = false;

import type { Metadata } from "next";
import { SignUpView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Sign up" };

export default function Page() {
  return (
    <SignUpView />
  );
}
