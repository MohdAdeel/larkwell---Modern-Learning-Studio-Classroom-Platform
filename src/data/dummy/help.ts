import type { HelpArticle } from "@/types";

export const helpArticles: HelpArticle[] = [
  {
    id: "help-what-is",
    title: "What Larkwell is",
    category: "Studio",
    body: "Larkwell is a studio for live teaching. Classes, whiteboards, and study notes stay together so a lesson can be picked up again. This build is a frontend demo: every record lives in your browser.",
  },
  {
    id: "help-roles",
    title: "Preview a role",
    category: "Studio",
    body: "Use Preview the studio in the header to enter as Maya Ellison, Helen Marlowe, or Irene Cho. You can switch any time. Nothing here signs you into a real account.",
  },
  {
    id: "help-boards",
    title: "Whiteboards and links",
    category: "Whiteboards",
    body: "Each board has a stable id, such as board-limits-curve. Copy link copies a URL that opens that board in this demo. The link does not publish the board to other people or other devices. Duplicating a board makes a new id and a separate copy.",
  },
  {
    id: "help-classroom",
    title: "The live classroom",
    category: "Classes",
    body: "The classroom is a simulated room. Microphone, camera, and screen share do not connect you to anyone else. If you turn the camera on, the preview stays on this device. A banner on the room says so.",
  },
  {
    id: "help-billing",
    title: "Plans and checkout",
    category: "Billing",
    body: "Checkout is a rehearsal. Card numbers are checked for shape only and are not sent anywhere. Changing a plan updates the demo membership stored in this browser.",
  },
  {
    id: "help-materials",
    title: "Study materials",
    category: "Library",
    body: "Materials are sample records. A few have text files you can download. Choosing a file in an upload dialog keeps the file name in the demo library. It is not stored on a server.",
  },
  {
    id: "help-reset",
    title: "Reset the demo",
    category: "Studio",
    body: "Settings on every role include Reset demo data. It clears this browser’s copy and restores the original studio. Other browsers are untouched.",
  },
  {
    id: "help-access",
    title: "Keyboard and motion",
    category: "Access",
    body: "Controls are meant to be reachable by keyboard. Dialogs close with Escape. If you prefer less motion, the interface follows your reduced-motion setting.",
  },
];
