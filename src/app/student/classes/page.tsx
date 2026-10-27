export const instant = false;

import type { Metadata } from "next";
import { MyClasses } from "@/features/learning/learning-views";

export const metadata: Metadata = { title: "Classes" };

export default function Page() {
  return (
    <MyClasses />
  );
}
