export const instant = false;

import type { Metadata } from "next";
import { OnboardingView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Welcome" };

export default function Page() {
  return (
    <OnboardingView />
  );
}
