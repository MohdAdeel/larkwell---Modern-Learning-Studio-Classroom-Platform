export type Role = "student" | "teacher" | "admin";

export type Session = {
  role: "guest" | Role;
  userId: string | null;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  avatarTone: number;
  gradeBand: string;
  timezone: string;
  joinedAt: string;
  interests: string[];
  learningGoals: string;
  status: "active" | "invited" | "suspended";
  bio: string;
  pace: "Steady" | "Intensive" | "Light";
  notificationPrefs: {
    email: boolean;
    classReminders: boolean;
    assignments: boolean;
    messages: boolean;
    productNotes: boolean;
  };
};

export type AvailabilitySlot = {
  day: string;
  slots: string[];
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  avatarTone: number;
  headline: string;
  subjects: string[];
  levels: string[];
  qualifications: string[];
  yearsExperience: number;
  teachingStyle: string;
  bio: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  timezone: string;
  availability: AvailabilitySlot[];
  verification: "verified" | "pending" | "needs-info";
  status: "active" | "suspended";
  joinedAt: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  title: string;
  avatarTone: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type CourseLevel = "Foundations" | "Intermediate" | "Advanced";
export type CourseStatus = "draft" | "in-review" | "published" | "archived";
export type CoverMotif = "arc" | "grid" | "leaf" | "orbit" | "wave";

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  level: CourseLevel;
  teacherId: string;
  language: string;
  durationHours: number;
  price: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  status: CourseStatus;
  tags: string[];
  outcomes: string[];
  cover: { from: string; to: string; motif: CoverMotif };
  updatedAt: string;
  createdAt: string;
};

export type LessonType = "video" | "reading" | "practice" | "live";

export type Section = {
  id: string;
  courseId: string;
  title: string;
  order: number;
};

export type Lesson = {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  summary: string;
  durationMin: number;
  type: LessonType;
  order: number;
};

export type Enrollment = {
  id: string;
  studentId: string;
  courseId: string;
  status: "active" | "completed" | "paused";
  completedLessonIds: string[];
  enrolledAt: string;
  lastOpenedAt: string;
};

export type AttendanceStatus = "present" | "late" | "absent";

export type LiveClass = {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  studentIds: string[];
  start: string;
  durationMin: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  agenda: string[];
  notes: string;
  boardId?: string;
  materialIds: string[];
  recurring: "none" | "weekly";
  attendance: { studentId: string; status: AttendanceStatus }[];
};

export type Point = { x: number; y: number };

export type StrokeTool =
  | "pen"
  | "highlighter"
  | "eraser"
  | "line"
  | "arrow"
  | "rect"
  | "ellipse"
  | "text";

export type Stroke = {
  id: string;
  tool: StrokeTool;
  color: string;
  width: number;
  points: Point[];
  text?: string;
};

export type BoardPage = {
  id: string;
  strokes: Stroke[];
};

export type BoardVisibility = "private" | "class" | "course" | "link";

export type Whiteboard = {
  id: string;
  title: string;
  ownerId: string;
  ownerRole: "teacher" | "student";
  courseId?: string;
  classId?: string;
  visibility: BoardVisibility;
  createdAt: string;
  updatedAt: string;
  background: "plain" | "grid";
  pages: BoardPage[];
};

export type MaterialType = "pdf" | "document" | "slides" | "image" | "video";
export type MaterialVisibility = "private" | "course" | "class";

export type Folder = {
  id: string;
  name: string;
  ownerId: string;
  parentId?: string;
};

export type Material = {
  id: string;
  title: string;
  type: MaterialType;
  subject: string;
  folderId: string;
  ownerId: string;
  courseId?: string;
  lessonId?: string;
  classId?: string;
  visibility: MaterialVisibility;
  updatedAt: string;
  sizeLabel: string;
  description: string;
  favoriteBy: string[];
  previewText: string;
  downloadHref?: string;
};

export type Assignment = {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  dueAt: string;
  status: "draft" | "open" | "closed";
  instructions: string;
  points: number;
  lessonId?: string;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: "not-started" | "in-progress" | "submitted" | "returned";
  submittedAt?: string;
  score?: number;
  feedback?: string;
  body?: string;
};

export type Plan = {
  id: string;
  audience: "student" | "teacher";
  name: string;
  monthly: number;
  annual: number;
  description: string;
  features: string[];
  limits: string[];
  recommended?: boolean;
};

export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  interval: "monthly" | "annual";
  status: "active" | "past-due" | "cancelled" | "trialing";
  renewsAt: string;
  startedAt: string;
};

export type Invoice = {
  id: string;
  userId: string;
  amount: number;
  status: "paid" | "open" | "refunded";
  description: string;
  issuedAt: string;
};

export type Earning = {
  id: string;
  teacherId: string;
  label: string;
  amount: number;
  paidAt: string;
  status: "paid" | "pending";
};

export type Notice = {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
  kind: "class" | "assignment" | "system" | "message" | "billing";
};

export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  subject: string;
  messages: ChatMessage[];
};

export type Review = {
  id: string;
  courseId: string;
  teacherId: string;
  studentId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  hidden: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "students" | "teachers";
  createdAt: string;
  authorId: string;
  status: "published" | "draft";
};

export type TicketReply = {
  id: string;
  authorId: string;
  body: string;
  sentAt: string;
};

export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  body: string;
  status: "open" | "waiting" | "resolved";
  priority: "low" | "normal" | "high";
  createdAt: string;
  category: string;
  replies: TicketReply[];
};

export type HelpArticle = {
  id: string;
  title: string;
  category: string;
  body: string;
};

export type AnalyticsPoint = {
  label: string;
  students: number;
  teachers: number;
  revenue: number;
  sessions: number;
};

export type PlatformSettings = {
  supportEmail: string;
  defaultClassMinutes: number;
  teacherReviewRequired: boolean;
  signupsOpen: boolean;
  banner: string;
};

export type AppState = {
  session: Session;
  students: Student[];
  teachers: Teacher[];
  admins: Admin[];
  categories: Category[];
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  classes: LiveClass[];
  boards: Whiteboard[];
  folders: Folder[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  earnings: Earning[];
  notices: Notice[];
  conversations: Conversation[];
  reviews: Review[];
  announcements: Announcement[];
  tickets: Ticket[];
  settings: PlatformSettings;
};
