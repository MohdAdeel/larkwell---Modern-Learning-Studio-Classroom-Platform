import type { AppState } from "@/types";
import { admins, categories } from "@/data/dummy/categories";
import { students } from "@/data/dummy/students";
import { teachers } from "@/data/dummy/teachers";
import { courses } from "@/data/dummy/courses";
import { lessons, sections } from "@/data/dummy/lessons";
import { enrollments } from "@/data/dummy/enrollments";
import { classes } from "@/data/dummy/classes";
import { boards } from "@/data/dummy/whiteboards";
import { folders, materials } from "@/data/dummy/materials";
import { assignments, submissions } from "@/data/dummy/assignments";
import { earnings, invoices, subscriptions } from "@/data/dummy/subscriptions";
import { notices } from "@/data/dummy/notifications";
import { conversations } from "@/data/dummy/messages";
import { announcements, reviews, tickets } from "@/data/dummy/reviews";

export const STORAGE_KEY = "larkwell-demo-v1";
export const STORAGE_VERSION = 1;

export function createSeed(): AppState {
  return {
    session: { role: "guest", userId: null },
    students: structuredClone(students),
    teachers: structuredClone(teachers),
    admins: structuredClone(admins),
    categories: structuredClone(categories),
    courses: structuredClone(courses),
    sections: structuredClone(sections),
    lessons: structuredClone(lessons),
    enrollments: structuredClone(enrollments),
    classes: structuredClone(classes),
    boards: structuredClone(boards),
    folders: structuredClone(folders),
    materials: structuredClone(materials),
    assignments: structuredClone(assignments),
    submissions: structuredClone(submissions),
    subscriptions: structuredClone(subscriptions),
    invoices: structuredClone(invoices),
    earnings: structuredClone(earnings),
    notices: structuredClone(notices),
    conversations: structuredClone(conversations),
    reviews: structuredClone(reviews),
    announcements: structuredClone(announcements),
    tickets: structuredClone(tickets),
    settings: {
      supportEmail: "studio@larkwell.demo",
      defaultClassMinutes: 55,
      teacherReviewRequired: true,
      signupsOpen: true,
      banner: "",
    },
  };
}
