import type { Enrollment } from "@/types";

function enrollment(
  id: string,
  studentId: string,
  courseId: string,
  status: Enrollment["status"],
  completed: string[],
  enrolledAt: string,
  lastOpenedAt: string,
): Enrollment {
  return {
    id,
    studentId,
    courseId,
    status,
    completedLessonIds: completed,
    enrolledAt,
    lastOpenedAt,
  };
}

const calc = (ids: string[]) => ids.map((id) => `lesson-quiet-calculus-${id}`);
const stats = (ids: string[]) => ids.map((id) => `lesson-statistics-calmly-${id}`);
const motion = (ids: string[]) => ids.map((id) => `lesson-motion-studio-${id}`);
const french = (ids: string[]) => ids.map((id) => `lesson-french-table-${id}`);
const programs = (ids: string[]) => ids.map((id) => `lesson-programs-care-${id}`);
const harmony = (ids: string[]) => ids.map((id) => `lesson-hearing-harmony-${id}`);
const cells = (ids: string[]) => ids.map((id) => `lesson-cell-stories-${id}`);
const essay = (ids: string[]) => ids.map((id) => `lesson-essay-architecture-${id}`);
const markets = (ids: string[]) => ids.map((id) => `lesson-markets-plain-${id}`);
const organic = (ids: string[]) => ids.map((id) => `lesson-organic-maps-${id}`);
const reading = (ids: string[]) => ids.map((id) => `lesson-close-reading-${id}`);
const spanish = (ids: string[]) => ids.map((id) => `lesson-spanish-hour-${id}`);
const atlantic = (ids: string[]) => ids.map((id) => `lesson-atlantic-worlds-${id}`);
const waves = (ids: string[]) => ids.map((id) => `lesson-waves-light-${id}`);

export const enrollments: Enrollment[] = [
  enrollment("enroll-maya-calc", "student-maya-01", "course-quiet-calculus", "active", calc(["11", "12", "13", "21"]), "2026-01-12T10:00:00", "2026-10-27T14:10:00"),
  enrollment("enroll-maya-french", "student-maya-01", "course-french-table", "active", french(["11", "12"]), "2026-02-02T10:00:00", "2026-10-24T18:00:00"),
  enrollment("enroll-maya-code", "student-maya-01", "course-programs-care", "active", programs(["11"]), "2026-09-08T10:00:00", "2026-10-20T19:00:00"),
  enrollment("enroll-maya-harmony", "student-maya-01", "course-hearing-harmony", "completed", harmony(["11", "12", "13", "21", "22", "23"]), "2026-02-20T10:00:00", "2026-08-30T16:00:00"),
  enrollment("enroll-owen-calc", "student-owen-01", "course-quiet-calculus", "active", calc(["11", "12", "13"]), "2026-02-02T10:00:00", "2026-10-26T17:00:00"),
  enrollment("enroll-owen-motion", "student-owen-01", "course-motion-studio", "active", motion(["11", "12", "13", "21"]), "2026-02-02T10:00:00", "2026-10-22T18:00:00"),
  enrollment("enroll-owen-stats", "student-owen-01", "course-statistics-calmly", "active", stats(["11"]), "2026-09-01T10:00:00", "2026-10-18T15:00:00"),
  enrollment("enroll-sofia-french", "student-sofia-01", "course-french-table", "active", french(["11", "12", "13"]), "2026-03-18T10:00:00", "2026-10-25T17:20:00"),
  enrollment("enroll-sofia-reading", "student-sofia-01", "course-close-reading", "active", reading(["11", "12"]), "2026-05-02T10:00:00", "2026-10-11T11:00:00"),
  enrollment("enroll-harun-atlantic", "student-harun-01", "course-atlantic-worlds", "active", atlantic(["11", "12"]), "2025-11-04T10:00:00", "2026-10-21T16:00:00"),
  enrollment("enroll-harun-markets", "student-harun-01", "course-markets-plain", "active", markets(["11", "12", "13"]), "2026-04-20T10:00:00", "2026-10-15T18:00:00"),
  enrollment("enroll-iris-calc", "student-iris-01", "course-quiet-calculus", "active", calc(["11", "12"]), "2026-01-20T10:00:00", "2026-10-25T15:00:00"),
  enrollment("enroll-iris-stats", "student-iris-01", "course-statistics-calmly", "active", stats(["11", "12", "13"]), "2026-02-01T10:00:00", "2026-10-19T15:00:00"),
  enrollment("enroll-iris-harmony", "student-iris-01", "course-hearing-harmony", "active", harmony(["11", "12", "13", "21"]), "2026-03-01T10:00:00", "2026-10-10T16:00:00"),
  enrollment("enroll-leo-code", "student-leo-01", "course-programs-care", "active", programs(["11", "12", "13", "21"]), "2026-04-09T10:00:00", "2026-10-26T20:00:00"),
  enrollment("enroll-leo-calc", "student-leo-01", "course-quiet-calculus", "paused", calc(["11"]), "2026-06-01T10:00:00", "2026-08-12T19:00:00"),
  enrollment("enroll-nina-cells", "student-nina-01", "course-cell-stories", "active", cells(["11", "12", "13"]), "2026-09-01T10:00:00", "2026-10-23T16:00:00"),
  enrollment("enroll-nina-organic", "student-nina-01", "course-organic-maps", "active", organic(["11"]), "2026-09-12T10:00:00", "2026-10-17T16:00:00"),
  enrollment("enroll-felix-motion", "student-felix-01", "course-motion-studio", "active", motion(["11", "12"]), "2026-02-14T10:00:00", "2026-10-22T18:10:00"),
  enrollment("enroll-felix-calc", "student-felix-01", "course-quiet-calculus", "active", calc(["11", "12", "13", "21"]), "2026-02-14T10:00:00", "2026-10-27T09:00:00"),
  enrollment("enroll-felix-waves", "student-felix-01", "course-waves-light", "active", waves(["11"]), "2026-09-02T10:00:00", "2026-10-02T18:00:00"),
  enrollment("enroll-aisha-markets", "student-aisha-01", "course-markets-plain", "active", markets(["11", "12", "13", "21", "22"]), "2025-10-22T10:00:00", "2026-10-20T19:30:00"),
  enrollment("enroll-aisha-essay", "student-aisha-01", "course-essay-architecture", "active", essay(["11", "12"]), "2026-03-12T10:00:00", "2026-10-13T19:00:00"),
  enrollment("enroll-tom-reading", "student-tom-01", "course-close-reading", "active", reading(["11", "12", "13", "21"]), "2026-05-03T10:00:00", "2026-10-18T09:00:00"),
  enrollment("enroll-tom-atlantic", "student-tom-01", "course-atlantic-worlds", "active", atlantic(["11"]), "2026-06-01T10:00:00", "2026-10-09T09:00:00"),
  enrollment("enroll-clara-organic", "student-clara-01", "course-organic-maps", "active", organic(["11", "12", "13", "21"]), "2026-01-08T10:00:00", "2026-10-24T11:00:00"),
  enrollment("enroll-clara-cells", "student-clara-01", "course-cell-stories", "completed", cells(["11", "12", "13", "21", "22", "23"]), "2026-01-20T10:00:00", "2026-06-18T11:00:00"),
  enrollment("enroll-hugo-french", "student-hugo-01", "course-french-table", "active", french(["11", "12", "13", "21"]), "2026-06-16T10:00:00", "2026-10-26T18:40:00"),
  enrollment("enroll-hugo-harmony", "student-hugo-01", "course-hearing-harmony", "active", harmony(["11", "12"]), "2026-07-01T10:00:00", "2026-10-06T18:00:00"),
  enrollment("enroll-priya-code", "student-priya-01", "course-programs-care", "active", programs(["11", "12", "13"]), "2026-03-02T10:00:00", "2026-10-21T19:00:00"),
  enrollment("enroll-priya-motion", "student-priya-01", "course-motion-studio", "active", motion(["11", "12", "13"]), "2026-03-02T10:00:00", "2026-10-16T18:00:00"),
  enrollment("enroll-malik-atlantic", "student-malik-01", "course-atlantic-worlds", "active", atlantic(["11", "12", "13", "21"]), "2025-12-11T10:00:00", "2026-10-21T12:00:00"),
  enrollment("enroll-malik-markets", "student-malik-01", "course-markets-plain", "active", markets(["11", "12"]), "2026-04-01T10:00:00", "2026-10-12T12:00:00"),
  enrollment("enroll-elena-harmony", "student-elena-01", "course-hearing-harmony", "active", harmony(["11", "12", "13", "21", "22"]), "2026-07-07T10:00:00", "2026-10-17T17:00:00"),
  enrollment("enroll-elena-spanish", "student-elena-01", "course-spanish-hour", "active", spanish(["11", "12"]), "2026-09-30T10:00:00", "2026-10-18T11:00:00"),
  enrollment("enroll-ruben-spanish", "student-ruben-01", "course-spanish-hour", "active", spanish(["11", "12", "13"]), "2026-08-19T10:00:00", "2026-10-25T09:30:00"),
  enrollment("enroll-ruben-atlantic", "student-ruben-01", "course-atlantic-worlds", "active", atlantic(["11", "12"]), "2026-08-19T10:00:00", "2026-10-08T09:00:00"),
  enrollment("enroll-hana-stats", "student-hana-01", "course-statistics-calmly", "active", [], "2026-10-20T10:00:00", "2026-10-20T10:00:00"),
];
