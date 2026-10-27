export const instant = false;

import type { Metadata } from "next";
import { AdminAnnouncements } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Announcements" };

export default function Page() {
  return (
    <AdminAnnouncements />
  );
}
