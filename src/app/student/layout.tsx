export const instant = false;

import { StudioFrame } from "@/components/layout/studio-frame";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudioFrame role="student">{children}</StudioFrame>;
}
