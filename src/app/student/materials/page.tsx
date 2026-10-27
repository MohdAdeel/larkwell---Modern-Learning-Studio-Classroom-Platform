export const instant = false;

import type { Metadata } from "next";
import { LibraryView } from "@/features/materials/material-views";

export const metadata: Metadata = { title: "Materials" };

export default function Page() {
  return (
    <LibraryView />
  );
}
