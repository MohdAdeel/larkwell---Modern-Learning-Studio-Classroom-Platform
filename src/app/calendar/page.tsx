export const instant = false;

import type { Metadata } from "next";
import { StudioFrame } from "@/components/layout/studio-frame";
import { CalendarView } from "@/features/calendar/calendar-view";

export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return (
    <StudioFrame>
      <CalendarView />
    </StudioFrame>
  );
}
