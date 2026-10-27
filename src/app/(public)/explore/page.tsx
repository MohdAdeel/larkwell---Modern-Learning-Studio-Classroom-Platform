export const instant = false;

import type { Metadata } from "next";
import { ExploreView } from "@/features/courses/explore-view";

export const metadata: Metadata = { title: "Explore courses" };

export default function Page() {
  return (
    <ExploreView />
  );
}
