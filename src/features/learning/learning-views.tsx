"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge, Card, EmptyState, PageHeader, ProgressBar, StatusBadge } from "@/components/ui/feedback";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/fields";
import { BarList } from "@/components/charts/charts";
import { useToast } from "@/components/ui/toast";
import { brand } from "@/config/brand";
import { compareIso, formatDate, formatDateTime } from "@/lib/formatters";
import {
  classesFor,
  courseById,
  enrollmentFor,
  lessonsForSection,
  progressFor,
  sectionsForCourse,
  teacherById,
} from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

function useStudent() {
  const store = useStore();
  const student = store.state.students.find((item) => item.id === store.state.session.userId);
  return { ...store, student };
}

export function StudentDashboard() {
  const { state, student } = useStudent();
  if (!student) return null;
  const enrollments = state.enrollments.filter((item) => item.studentId === student.id);
  const upcoming = classesFor(state, "student", student.id)
    .filter((item) => item.status === "live" || item.status === "scheduled")
    .sort((a, b) => compareIso(a.start, b.start))
    .slice(0, 3);
  const notices = state.notices.filter((item) => item.userId === student.id).slice(0, 3);
  const hour = 15;
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Learning studio" title={`${greeting}, ${student.name.split(" ")[0]}`} description={student.learningGoals} actions={<LinkButton href={routes.explore} variant="secondary">Find a course</LinkButton>} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-muted">Active courses</p><p className="font-serif text-4xl">{enrollments.filter((item) => item.status === "active").length}</p></Card>
        <Card><p className="text-sm text-muted">Completed</p><p className="font-serif text-4xl">{enrollments.filter((item) => item.status === "completed").length}</p></Card>
        <Card><p className="text-sm text-muted">Next live hours</p><p className="font-serif text-4xl">{upcoming.length}</p></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-serif text-2xl">Continue</h2>
          <div className="mt-4 space-y-4">
            {enrollments.filter((item) => item.status !== "completed").slice(0, 3).map((enrollment) => {
              const course = courseById(state, enrollment.courseId);
              if (!course) return null;
              const progress = progressFor(state, student.id, course.id);
              return (
                <div key={enrollment.id}>
                  <div className="flex items-center justify-between text-sm">
                    <Link href={routes.student.course(course.id)} className="font-medium">{course.title}</Link>
                    <span className="text-muted">{progress}%</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={progress} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="font-serif text-2xl">Coming up</h2>
          <ul className="mt-4 space-y-3">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted">{formatDateTime(item.start)}</p>
                </div>
                <LinkButton href={routes.classroom(item.id)} size="sm">{item.status === "live" ? "Join" : "Preview"}</LinkButton>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h2 className="font-serif text-2xl">Recent notes</h2>
        <ul className="mt-4 space-y-3">
          {notices.map((notice) => (
            <li key={notice.id} className="text-sm">
              <Link href={notice.href ?? routes.student.notifications} className="font-medium">{notice.title}</Link>
              <p className="text-muted">{notice.body}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function MyCourses() {
  const { state, student } = useStudent();
  if (!student) return null;
  const rows = state.enrollments.filter((item) => item.studentId === student.id);
  return (
    <div className="space-y-6">
      <PageHeader title="My courses" description="Progress is counted from lessons you mark complete." />
      <div className="grid gap-4">
        {rows.map((enrollment) => {
          const course = courseById(state, enrollment.courseId);
          if (!course) return null;
          const progress = progressFor(state, student.id, course.id);
          return (
            <Card key={enrollment.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2"><StatusBadge status={enrollment.status} /><Badge>{course.level}</Badge></div>
                <h2 className="mt-2 font-serif text-2xl">{course.title}</h2>
                <p className="text-sm text-muted">{teacherById(state, course.teacherId)?.name}</p>
                <div className="mt-3 max-w-md"><ProgressBar value={progress} /></div>
              </div>
              <LinkButton href={routes.student.course(course.id)}>Continue</LinkButton>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function StudentCourse() {
  const params = useParams<{ courseId: string }>();
  const { state, actions, student } = useStudent();
  const toast = useToast();
  const course = courseById(state, params.courseId);
  if (!student || !course) return <EmptyState title="Course unavailable" body="Enroll from the public course page first." />;
  const enrollment = enrollmentFor(state, student.id, course.id);
  if (!enrollment) return <EmptyState title="You are not enrolled" body="Join the course from its public page." action={<LinkButton href={routes.course(course.id)}>View course</LinkButton>} />;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Course" title={course.title} description={course.subtitle} actions={<LinkButton href={routes.course(course.id)} variant="secondary">Public page</LinkButton>} />
      {sectionsForCourse(state, course.id).map((section) => (
        <Card key={section.id}>
          <h2 className="font-serif text-2xl">{section.title}</h2>
          <ul className="mt-4 space-y-3">
            {lessonsForSection(state, section.id).map((lesson) => {
              const done = enrollment.completedLessonIds.includes(lesson.id);
              return (
                <li key={lesson.id} className="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted">{lesson.summary}</p>
                  </div>
                  <Button
                    variant={done ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => {
                      actions.toggleLesson(student.id, course.id, lesson.id);
                      toast({ title: done ? "Marked incomplete" : "Lesson marked complete" });
                    }}
                  >
                    {done ? "Completed" : "Mark complete"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function MyClasses() {
  const { state, student } = useStudent();
  const [mode, setMode] = useState<"list" | "calendar">("list");
  if (!student) return null;
  const items = classesFor(state, "student", student.id).sort((a, b) => compareIso(a.start, b.start));
  return (
    <div className="space-y-6">
      <PageHeader title="My classes" description={`Sample week anchored to ${formatDate(brand.demoNow)}.`} actions={<Button variant="secondary" onClick={() => setMode(mode === "list" ? "calendar" : "list")}>{mode === "list" ? "Calendar view" : "List view"}</Button>} />
      {mode === "calendar" ? <LinkButton href={routes.calendar}>Open the full calendar</LinkButton> : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <StatusBadge status={item.status} />
              <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
              <p className="text-sm text-muted">{formatDateTime(item.start)} · {item.durationMin} min · {teacherById(state, item.teacherId)?.name}</p>
            </div>
            <LinkButton href={routes.classroom(item.id)}>{item.status === "completed" ? "Review room" : "Open room"}</LinkButton>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StudentAssignments() {
  const { state, student } = useStudent();
  if (!student) return null;
  const mine = state.submissions.filter((item) => item.studentId === student.id);
  return (
    <div className="space-y-4">
      <PageHeader title="Assignments" description="Due dates and status from the demo courses you have joined." />
      {mine.map((submission) => {
        const assignment = state.assignments.find((item) => item.id === submission.assignmentId);
        if (!assignment || assignment.status === "draft") return null;
        return (
          <Card key={submission.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <StatusBadge status={submission.status} />
              <h2 className="mt-2 font-medium">{assignment.title}</h2>
              <p className="text-sm text-muted">Due {formatDateTime(assignment.dueAt)} · {courseById(state, assignment.courseId)?.title}</p>
            </div>
            <LinkButton href={routes.student.assignment(assignment.id)} variant="secondary">Open</LinkButton>
          </Card>
        );
      })}
    </div>
  );
}

export function StudentAssignment() {
  const params = useParams<{ assignmentId: string }>();
  const { state, actions, student } = useStudent();
  const toast = useToast();
  const assignment = state.assignments.find((item) => item.id === params.assignmentId);
  const submission = state.submissions.find((item) => item.assignmentId === params.assignmentId && item.studentId === student?.id);
  const [body, setBody] = useState(submission?.body ?? "");
  if (!assignment || !student) return <EmptyState title="Assignment missing" body="It is not on your list." />;
  return (
    <div className="space-y-4">
      <PageHeader title={assignment.title} description={`Due ${formatDateTime(assignment.dueAt)} · ${assignment.points} points`} />
      <Card>
        <p className="text-sm leading-6 text-ink-soft">{assignment.instructions}</p>
        {submission?.feedback ? <p className="mt-4 rounded-2xl bg-sage-soft p-3 text-sm">Feedback: {submission.feedback} {submission.score != null ? `· ${submission.score}/${assignment.points}` : ""}</p> : null}
        <div className="mt-4">
          <Field label="Your work" htmlFor="work">
            <Textarea id="work" value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => { actions.saveSubmission(assignment.id, student.id, body, false); toast({ title: "Draft saved" }); }}>Save draft</Button>
          <Button onClick={() => { actions.saveSubmission(assignment.id, student.id, body, true); toast({ title: "Submitted", tone: "success" }); }}>Submit</Button>
        </div>
      </Card>
    </div>
  );
}

export function ProgressView() {
  const { state, student } = useStudent();
  if (!student) return null;
  const rows = state.enrollments.filter((item) => item.studentId === student.id).map((enrollment) => {
    const course = courseById(state, enrollment.courseId);
    return { label: course?.title ?? "Course", value: progressFor(state, student.id, enrollment.courseId) };
  });
  const completed = state.enrollments.filter((item) => item.studentId === student.id && item.status === "completed").length;
  return (
    <div className="space-y-6">
      <PageHeader title="Progress" description="A quiet view of what you have finished in the demo." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-muted">Courses finished</p><p className="font-serif text-4xl">{completed}</p></Card>
        <Card><p className="text-sm text-muted">Lessons marked</p><p className="font-serif text-4xl">{state.enrollments.filter((item) => item.studentId === student.id).reduce((sum, item) => sum + item.completedLessonIds.length, 0)}</p></Card>
        <Card><p className="text-sm text-muted">Classes attended</p><p className="font-serif text-4xl">{state.classes.filter((item) => item.attendance.some((entry) => entry.studentId === student.id && entry.status !== "absent")).length}</p></Card>
      </div>
      <Card><h2 className="mb-4 font-serif text-2xl">By course</h2><BarList items={rows.map((row) => ({ ...row, hint: `${row.value}%` }))} /></Card>
    </div>
  );
}

export function StudentReviews() {
  const { state, actions, student } = useStudent();
  const toast = useToast();
  const [courseId, setCourseId] = useState(state.enrollments.find((item) => item.studentId === student?.id)?.courseId ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  if (!student) return null;
  const mine = state.reviews.filter((review) => review.studentId === student.id);
  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Notes you leave are labeled as fictional demo content on public pages." />
      <Card>
        <div className="grid gap-3">
          <Field label="Course" htmlFor="review-course">
            <select id="review-course" className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
              {state.enrollments.filter((item) => item.studentId === student.id).map((item) => (
                <option key={item.id} value={item.courseId}>{courseById(state, item.courseId)?.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Title" htmlFor="review-title"><Input id="review-title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="Note" htmlFor="review-body"><Textarea id="review-body" value={body} onChange={(event) => setBody(event.target.value)} /></Field>
          <Field label="Rating" htmlFor="rating">
            <Input id="rating" type="number" min={1} max={5} value={rating} onChange={(event) => setRating(Number(event.target.value))} />
          </Field>
          <Button onClick={() => {
            const course = courseById(state, courseId);
            if (!course || !title.trim() || !body.trim()) return;
            actions.addReview({ courseId, teacherId: course.teacherId, studentId: student.id, rating, title, body });
            setTitle("");
            setBody("");
            toast({ title: "Review saved", tone: "success" });
          }}>Publish note</Button>
        </div>
      </Card>
      {mine.map((review) => (
        <Card key={review.id}><h2 className="font-medium">{review.title}</h2><p className="mt-2 text-sm text-ink-soft">{review.body}</p></Card>
      ))}
    </div>
  );
}

export function StudentSettings() {
  const { actions, student } = useStudent();
  const toast = useToast();
  const [name, setName] = useState(student?.name ?? "");
  const [goals, setGoals] = useState(student?.learningGoals ?? "");
  const [pace, setPace] = useState(student?.pace ?? "Steady");
  const [prefs, setPrefs] = useState(student?.notificationPrefs);
  if (!student || !prefs) return null;
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Learning preferences stay in this browser." />
      <Card>
        <div className="grid gap-3">
          <Field label="Name" htmlFor="student-name"><Input id="student-name" value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <Field label="Aim" htmlFor="goals"><Textarea id="goals" value={goals} onChange={(event) => setGoals(event.target.value)} /></Field>
          <Field label="Pace" htmlFor="pace">
            <select id="pace" className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" value={pace} onChange={(event) => setPace(event.target.value as typeof pace)}>
              <option>Steady</option><option>Intensive</option><option>Light</option>
            </select>
          </Field>
          <Checkbox label="Class reminders" checked={prefs.classReminders} onChange={(event) => setPrefs({ ...prefs, classReminders: event.target.checked })} />
          <Checkbox label="Assignment notes" checked={prefs.assignments} onChange={(event) => setPrefs({ ...prefs, assignments: event.target.checked })} />
          <Checkbox label="Messages" checked={prefs.messages} onChange={(event) => setPrefs({ ...prefs, messages: event.target.checked })} />
          <Button onClick={() => { actions.updateStudent(student.id, { name, learningGoals: goals, pace, notificationPrefs: prefs }); toast({ title: "Settings saved", tone: "success" }); }}>Save</Button>
        </div>
      </Card>
    </div>
  );
}

export function NoticeCenter({ userId }: { userId: string | null }) {
  const { state, actions } = useStore();
  const notices = state.notices.filter((notice) => notice.userId === userId);
  const announcements = state.announcements.filter((item) => item.status === "published");
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Class notes, assignments, and studio announcements." actions={<Button variant="secondary" onClick={() => userId && actions.markAllNotices(userId)}>Mark all read</Button>} />
      {announcements.map((item) => (
        <Card key={item.id}><Badge tone="gold">Announcement</Badge><h2 className="mt-2 font-serif text-2xl">{item.title}</h2><p className="mt-2 text-sm text-ink-soft">{item.body}</p></Card>
      ))}
      {notices.length === 0 ? <EmptyState title="You are caught up" body="New class and assignment notes will land here." /> : null}
      {notices.map((notice) => (
        <Card key={notice.id} className="flex items-start justify-between gap-3">
          <div>
            <StatusBadge status={notice.read ? "completed" : "open"} />
            <h2 className="mt-2 font-medium">{notice.title}</h2>
            <p className="text-sm text-muted">{notice.body}</p>
            <p className="mt-1 text-xs text-muted">{formatDateTime(notice.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            {notice.href ? <LinkButton href={notice.href} size="sm" variant="secondary">Open</LinkButton> : null}
            <Button size="sm" variant="ghost" onClick={() => actions.markNotice(notice.id, !notice.read)}>{notice.read ? "Unread" : "Read"}</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SessionNotices() {
  const { state } = useStore();
  return <NoticeCenter userId={state.session.userId} />;
}
