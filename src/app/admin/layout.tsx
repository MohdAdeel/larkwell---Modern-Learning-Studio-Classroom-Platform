export const instant = false;

import { StudioFrame } from "@/components/layout/studio-frame";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <StudioFrame role="admin">{children}</StudioFrame>;
}
