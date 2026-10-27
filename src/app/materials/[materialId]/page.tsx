export const instant = false;

import type { Metadata } from "next";
import { MaterialDetail } from "@/features/materials/material-views";

export const metadata: Metadata = { title: "Material" };

export default function Page() {
  return (
    <MaterialDetail />
  );
}
