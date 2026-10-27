export const instant = false;

import { StudioFrame } from "@/components/layout/studio-frame";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <StudioFrame role="teacher">{children}</StudioFrame>;
}
