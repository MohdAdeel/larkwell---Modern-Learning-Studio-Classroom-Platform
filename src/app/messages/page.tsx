export const instant = false;

import type { Metadata } from "next";
import { StudioFrame } from "@/components/layout/studio-frame";
import { InboxView } from "@/features/messages/inbox";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return (
    <StudioFrame>
      <InboxView />
    </StudioFrame>
  );
}
