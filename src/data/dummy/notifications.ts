import type { Notice } from "@/types";

export const notices: Notice[] = [
  { id: "note-maya-1", userId: "student-maya-01", title: "Limits is live", body: "Helen’s class is open. The board from last week is attached.", createdAt: "2026-10-27T15:28:00", read: false, href: "/classroom/class-limits-live", kind: "class" },
  { id: "note-maya-2", userId: "student-maya-01", title: "Limits, set three", body: "Due Friday. The sentence comes before the algebra.", createdAt: "2026-10-26T09:00:00", read: false, href: "/student/assignments/assign-limits-set", kind: "assignment" },
  { id: "note-maya-3", userId: "student-maya-01", title: "Camille left a note", body: "Market phrases are in the library for Thursday.", createdAt: "2026-10-25T17:10:00", read: true, href: "/materials/material-french-phrases", kind: "message" },
  { id: "note-maya-4", userId: "student-maya-01", title: "October membership", body: "Studio membership for October is marked paid in the demo ledger.", createdAt: "2026-10-12T08:00:00", read: true, href: "/student/subscriptions", kind: "billing" },
  { id: "note-helen-1", userId: "teacher-helen-01", title: "Felix submitted set three", body: "A written sketch is waiting for your note.", createdAt: "2026-10-26T22:12:00", read: false, href: "/teacher/assignments/assign-limits-set", kind: "assignment" },
  { id: "note-helen-2", userId: "teacher-helen-01", title: "Hana was invited", body: "She has a reader seat and has not joined a live hour yet.", createdAt: "2026-10-20T11:00:00", read: false, href: "/teacher/students/student-hana-01", kind: "system" },
  { id: "note-helen-3", userId: "teacher-helen-01", title: "October pool is pending", body: "The demo ledger shows $860 waiting.", createdAt: "2026-10-25T09:00:00", read: true, href: "/teacher/subscription", kind: "billing" },
  { id: "note-jonah-1", userId: "teacher-jonah-01", title: "Ramp class tomorrow", body: "Owen, Felix, and Priya are on the list.", createdAt: "2026-10-27T08:00:00", read: false, href: "/teacher/classes/class-motion-wed", kind: "class" },
  { id: "note-irene-1", userId: "admin-irene-01", title: "Inés Vidal is waiting", body: "A new teacher profile needs a verification decision.", createdAt: "2026-10-26T14:00:00", read: false, href: "/admin/teachers/teacher-ines-01", kind: "system" },
  { id: "note-irene-2", userId: "admin-irene-01", title: "Field Journal is in review", body: "Leila submitted a course for moderation.", createdAt: "2026-10-25T10:20:00", read: false, href: "/admin/courses", kind: "system" },
  { id: "note-irene-3", userId: "admin-irene-01", title: "Felix’s invoice is open", body: "Conservatory October is past due in the demo ledger.", createdAt: "2026-10-21T09:00:00", read: true, href: "/admin/subscriptions", kind: "billing" },
  { id: "note-sofia-1", userId: "student-sofia-01", title: "Market note received", body: "Camille has your lines. This is a demo receipt, not a grade.", createdAt: "2026-10-25T19:05:00", read: false, href: "/student/assignments/assign-french-menu", kind: "assignment" },
  { id: "note-leo-1", userId: "student-leo-01", title: "Monday debugging hour", body: "Mateo posted the agenda for Reading an error.", createdAt: "2026-10-27T07:40:00", read: false, href: "/classroom/class-programs-mon", kind: "class" },
  { id: "note-mateo-1", userId: "teacher-mateo-01", title: "Leo sent a fix", body: "One honest fix is ready to read.", createdAt: "2026-10-27T08:42:00", read: false, href: "/teacher/assignments/assign-program-bug", kind: "assignment" },
  { id: "note-camille-1", userId: "teacher-camille-01", title: "Sofia sent the market note", body: "Six lines, including a question about price.", createdAt: "2026-10-25T19:02:00", read: true, href: "/teacher/assignments/assign-french-menu", kind: "assignment" },
];
