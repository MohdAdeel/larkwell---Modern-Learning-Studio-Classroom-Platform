import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  CreditCard,
  FolderOpen,
  House,
  Library,
  LifeBuoy,
  Megaphone,
  MessagesSquare,
  PenLine,
  Settings,
  Tags,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/lib/routes";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const studentNav: NavItem[] = [
  { href: routes.student.dashboard, label: "Overview", icon: House },
  { href: routes.student.courses, label: "Courses", icon: BookOpen },
  { href: routes.student.classes, label: "Classes", icon: Video },
  { href: routes.calendar, label: "Calendar", icon: CalendarDays },
  { href: routes.student.whiteboards, label: "Whiteboards", icon: PenLine },
  { href: routes.student.materials, label: "Materials", icon: FolderOpen },
  { href: routes.student.assignments, label: "Assignments", icon: ClipboardCheck },
  { href: routes.student.progress, label: "Progress", icon: ChartColumn },
  { href: routes.student.reviews, label: "Reviews", icon: Library },
  { href: routes.messages, label: "Messages", icon: MessagesSquare },
  { href: routes.student.notifications, label: "Notifications", icon: Bell },
  { href: routes.student.subscriptions, label: "Membership", icon: CreditCard },
  { href: routes.student.settings, label: "Settings", icon: Settings },
];

export const teacherNav: NavItem[] = [
  { href: routes.teacher.dashboard, label: "Overview", icon: House },
  { href: routes.teacher.profile, label: "Public profile", icon: Library },
  { href: routes.teacher.courses, label: "Courses", icon: BookOpen },
  { href: routes.teacher.students, label: "Students", icon: Users },
  { href: routes.teacher.classes, label: "Schedule", icon: CalendarDays },
  { href: routes.teacher.live, label: "Live sessions", icon: Video },
  { href: routes.teacher.whiteboards, label: "Whiteboards", icon: PenLine },
  { href: routes.teacher.materials, label: "Materials", icon: FolderOpen },
  { href: routes.teacher.assignments, label: "Assignments", icon: ClipboardCheck },
  { href: routes.teacher.reviews, label: "Reviews", icon: Library },
  { href: routes.messages, label: "Messages", icon: MessagesSquare },
  { href: routes.teacher.notifications, label: "Notifications", icon: Bell },
  { href: routes.teacher.subscription, label: "Plan", icon: CreditCard },
  { href: routes.teacher.availability, label: "Availability", icon: CalendarDays },
  { href: routes.teacher.settings, label: "Settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { href: routes.admin.dashboard, label: "Overview", icon: House },
  { href: routes.admin.students, label: "Students", icon: Users },
  { href: routes.admin.teachers, label: "Teachers", icon: Library },
  { href: routes.admin.courses, label: "Courses", icon: BookOpen },
  { href: routes.admin.classes, label: "Live classes", icon: Video },
  { href: routes.admin.content, label: "Content", icon: FolderOpen },
  { href: routes.admin.subscriptions, label: "Billing", icon: CreditCard },
  { href: routes.admin.analytics, label: "Reports", icon: ChartColumn },
  { href: routes.admin.categories, label: "Subjects", icon: Tags },
  { href: routes.admin.announcements, label: "Announcements", icon: Megaphone },
  { href: routes.admin.support, label: "Support", icon: LifeBuoy },
  { href: routes.admin.settings, label: "Settings", icon: Settings },
];

export const demoProfiles = [
  { role: "guest" as const, userId: null, label: "Visitor", detail: "Public pages" },
  { role: "student" as const, userId: "student-maya-01", label: "Maya Ellison", detail: "Student" },
  { role: "student" as const, userId: "student-owen-01", label: "Owen Park", detail: "Student" },
  { role: "teacher" as const, userId: "teacher-helen-01", label: "Helen Marlowe", detail: "Teacher" },
  { role: "teacher" as const, userId: "teacher-jonah-01", label: "Jonah Adler", detail: "Teacher" },
  { role: "teacher" as const, userId: "teacher-camille-01", label: "Camille Voss", detail: "Teacher" },
  { role: "admin" as const, userId: "admin-irene-01", label: "Irene Cho", detail: "Administrator" },
];
