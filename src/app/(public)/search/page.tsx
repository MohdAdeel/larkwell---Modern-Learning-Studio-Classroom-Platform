export const instant = false;

import type { Metadata } from "next";
import { SearchView } from "@/features/marketing/info-views";

export const metadata: Metadata = { title: "Search" };

export default function Page() {
  return (
    <SearchView />
  );
}
