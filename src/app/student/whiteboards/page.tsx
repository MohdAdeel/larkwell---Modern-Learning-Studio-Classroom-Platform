export const instant = false;

import type { Metadata } from "next";
import { MyBoards } from "@/features/whiteboard/board-views";

export const metadata: Metadata = { title: "Whiteboards" };

export default function Page() {
  return (
    <MyBoards />
  );
}
