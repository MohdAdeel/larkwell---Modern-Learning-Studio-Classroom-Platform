export const instant = false;

import type { Metadata } from "next";
import { SignInView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <SignInView />
  );
}
