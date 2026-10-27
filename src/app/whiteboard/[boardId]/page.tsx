export const instant = false;

import type { Metadata } from "next";
import { BoardWorkspace } from "@/features/whiteboard/board-views";

export const metadata: Metadata = { title: "Whiteboard" };

export default function Page() {
  return (
    <BoardWorkspace />
  );
}
