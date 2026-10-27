import type { Admin, Category } from "@/types";

export const admins: Admin[] = [
  {
    id: "admin-irene-01",
    name: "Irene Cho",
    email: "irene.cho@larkwell.demo",
    title: "Studio steward",
    avatarTone: 2,
  },
];

export const categories: Category[] = [
  {
    id: "cat-mathematics",
    name: "Mathematics",
    description: "Calculus, statistics, and the pictures underneath them.",
  },
  {
    id: "cat-physics",
    name: "Physics",
    description: "Motion, waves, and diagrams that earn the formula.",
  },
  {
    id: "cat-biology",
    name: "Biology",
    description: "Cells, field notes, and living systems drawn by hand.",
  },
  {
    id: "cat-chemistry",
    name: "Chemistry",
    description: "Maps of molecules, lab notes, and careful patterns.",
  },
  {
    id: "cat-languages",
    name: "Languages",
    description: "Conversation studios for French and Spanish.",
  },
  {
    id: "cat-history",
    name: "History",
    description: "Seminars built around documents and argument.",
  },
  {
    id: "cat-literature",
    name: "Literature",
    description: "Close reading for people who want the sentence to matter.",
  },
  {
    id: "cat-writing",
    name: "Writing",
    description: "Essays with a claim, a shape, and a last line.",
  },
  {
    id: "cat-music",
    name: "Music",
    description: "Harmony, listening, and the names for what you hear.",
  },
  {
    id: "cat-computing",
    name: "Computing",
    description: "Small programs written slowly enough to trust.",
  },
  {
    id: "cat-economics",
    name: "Economics",
    description: "Markets explained in language a neighbor could follow.",
  },
];
