export const instant = false;

import type { Metadata } from "next";
import { AdminTicket } from "@/features/admin/admin-views";

export const metadata: Metadata = { title: "Ticket" };

export default function Page() {
  return (
    <AdminTicket />
  );
}
