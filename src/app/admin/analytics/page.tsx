export const instant = false;

import type { Metadata } from "next";
import { AdminAnalytics } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Reports" };

export default function Page() {
  return (
    <AdminAnalytics />
  );
}
