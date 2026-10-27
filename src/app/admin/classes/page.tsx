export const instant = false;

import type { Metadata } from "next";
import { AdminClasses } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Live classes" };

export default function Page() {
  return (
    <AdminClasses />
  );
}
