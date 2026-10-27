"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import { useConfirm } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { compareIso, formatDateTime, formatMoney } from "@/lib/formatters";
import { classesFor, courseById, lessonsForSection, personById, progressFor, sectionsForCourse, studentById, studentsForTeacher } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import type { CourseLevel } from "@/types";

function useTeacher() {
  const store = useStore();
  const teacher = store.state.teachers.find((item) => item.id === store.state.session.userId);
  return { ...store, teacher };
}

export function TeacherDashboard() {
  const { state, teacher } = useTeacher();
  if (!teacher) return null;
  const courses = state.courses.filter((course) => course.teacherId === teacher.id);
  const upcoming = classesFor(state, "teacher", teacher.id).filter((item) => item.status === "scheduled" || item.status === "live").sort((a, b) => compareIso(a.start, b.start)).slice(0, 4);
  const students = studentsForTeacher(state, teacher.id);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teaching studio" title={`Hello, ${teacher.name.split(" ")[0]}`} description={teacher.headline} actions={<LinkButton href={routes.teacher.newCourse}>New course</LinkButton>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-muted">Students</p><p className="font-serif text-4xl">{students.length}</p></Card>
        <Card><p className="text-sm text-muted">Courses</p><p className="font-serif text-4xl">{courses.length}</p></Card>
        <Card><p className="text-sm text-muted">Upcoming</p><p className="font-serif text-4xl">{upcoming.length}</p></Card>
        <Card><p className="text-sm text-muted">Pending pool</p><p className="font-serif text-4xl">{formatMoney(state.earnings.filter((item) => item.teacherId === teacher.id && item.status === "pending").reduce((sum, item) => sum + item.amount, 0))}</p></Card>
      </div>
      <Card>
        <h2 className="font-serif text-2xl">Next classes</h2>
        <ul className="mt-4 space-y-3">
          {upcoming.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <div><p className="font-medium">{item.title}</p><p className="text-muted">{formatDateTime(item.start)}</p></div>
              <LinkButton href={routes.classroom(item.id)} size="sm">Open room</LinkButton>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function ProfileEditor() {
  const { state, actions, teacher } = useTeacher();
  const toast = useToast();
  const [headline, setHeadline] = useState(teacher?.headline ?? "");
  const [bio, setBio] = useState(teacher?.bio ?? "");
  const [style, setStyle] = useState(teacher?.teachingStyle ?? "");
  if (!teacher) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <PageHeader title="Public profile" description="What students read before they join a course." />
        <Field label="Headline" htmlFor="headline"><Input id="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} /></Field>
        <Field label="Bio" htmlFor="bio"><Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} /></Field>
        <Field label="Teaching style" htmlFor="style"><Textarea id="style" value={style} onChange={(event) => setStyle(event.target.value)} /></Field>
        <Button onClick={() => { actions.updateTeacher(teacher.id, { headline, bio, teachingStyle: style }); toast({ title: "Profile saved", tone: "success" }); }}>Save</Button>
      </div>
      <Card>
        <p className="text-xs uppercase tracking-[0.16em] text-teal">Preview</p>
        <h2 className="mt-2 font-serif text-3xl">{teacher.name}</h2>
        <p className="mt-2 text-ink-soft">{headline}</p>
        <p className="mt-3 text-sm leading-6">{bio}</p>
        <p className="mt-3 text-sm text-muted">{style}</p>
        <LinkButton href={routes.teacherProfile(teacher.id)} variant="secondary" className="mt-4">Open public page</LinkButton>
        <p className="mt-4 text-xs text-muted">Verification: {teacher.verification}. Reviews on file: {state.reviews.filter((review) => review.teacherId === teacher.id && !review.hidden).length}.</p>
      </Card>
    </div>
  );
}

export function CourseManager() {
  const { state, actions, teacher } = useTeacher();
  const confirm = useConfirm();
  const toast = useToast();
  if (!teacher) return null;
  const courses = state.courses.filter((course) => course.teacherId === teacher.id);
  return (
    <div className="space-y-4">
      <PageHeader title="Courses" description="Draft, review, publish, or archive. Students only see published courses." actions={<LinkButton href={routes.teacher.newCourse}>Create course</LinkButton>} />
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusBadge status={course.status} />
            <h2 className="mt-2 font-serif text-2xl">{course.title}</h2>
            <p className="text-sm text-muted">{course.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={routes.teacher.course(course.id)} size="sm" variant="secondary">Curriculum</LinkButton>
            {course.status !== "published" ? <Button size="sm" onClick={() => { actions.updateCourse(course.id, { status: "published" }); toast({ title: "Published" }); }}>Publish</Button> : null}
            {course.status === "published" ? <Button size="sm" variant="secondary" onClick={() => actions.updateCourse(course.id, { status: "draft" })}>Unpublish</Button> : null}
            <Button size="sm" variant="ghost" onClick={async () => {
              const ok = await confirm({ title: "Archive this course?", body: "It leaves the public catalog. Enrollment already made stays in the demo records.", confirmLabel: "Archive", tone: "danger" });
              if (!ok) return;
              actions.updateCourse(course.id, { status: "archived" });
              toast({ title: "Archived" });
            }}>Archive</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function NewCourse() {
  const { actions, teacher, state } = useTeacher();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(state.categories[0]?.id ?? "");
  const [level, setLevel] = useState<CourseLevel>("Foundations");
  if (!teacher) return null;
  return (
    <div className="max-w-xl space-y-4">
      <PageHeader title="New course" description="It begins as a draft with one empty section." />
      <Field label="Title" htmlFor="title"><Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
      <Field label="Subtitle" htmlFor="subtitle"><Input id="subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></Field>
      <Field label="Description" htmlFor="description"><Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} /></Field>
      <Field label="Subject" htmlFor="category">
        <Select id="category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          {state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </Select>
      </Field>
      <Field label="Level" htmlFor="level">
        <Select id="level" value={level} onChange={(event) => setLevel(event.target.value as CourseLevel)}>
          <option>Foundations</option><option>Intermediate</option><option>Advanced</option>
        </Select>
      </Field>
      <Button onClick={() => {
        if (!title.trim()) return;
        const id = actions.createCourse({ title, subtitle, description, categoryId, level, teacherId: teacher.id, language: "English", price: 0 });
        router.push(routes.teacher.course(id));
      }}>Create draft</Button>
    </div>
  );
}

export function CourseBuilder() {
  const params = useParams<{ courseId: string }>();
  const { state, actions, teacher } = useTeacher();
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [sectionId, setSectionId] = useState("");
  const course = courseById(state, params.courseId);
  if (!course || course.teacherId !== teacher?.id) return <EmptyState title="Course not in your studio" body="Open a course you teach." />;
  const sections = sectionsForCourse(state, course.id);
  return (
    <div className="space-y-6">
      <PageHeader title={course.title} description="Build the curriculum. Changes stay in this browser." />
      <Card>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input aria-label="Section title" placeholder="New section" value={sectionTitle} onChange={(event) => setSectionTitle(event.target.value)} />
          <Button onClick={() => { if (sectionTitle.trim()) { actions.addSection(course.id, sectionTitle.trim()); setSectionTitle(""); } }}>Add section</Button>
        </div>
      </Card>
      {sections.map((section) => (
        <Card key={section.id}>
          <h2 className="font-serif text-2xl">{section.title}</h2>
          <ul className="mt-3 space-y-2">
            {lessonsForSection(state, section.id).map((lesson) => (
              <li key={lesson.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{lesson.title}</span>
                <span className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => actions.moveLesson(lesson.id, -1)}>Up</Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.moveLesson(lesson.id, 1)}>Down</Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.deleteLesson(lesson.id)}>Remove</Button>
                </span>
              </li>
            ))}
          </ul>
          {sectionId === section.id ? (
            <div className="mt-3 flex gap-2">
              <Input aria-label="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} placeholder="Lesson title" />
              <Button onClick={() => { if (lessonTitle.trim()) { actions.addLesson(section.id, lessonTitle.trim(), "A new lesson in the draft curriculum."); setLessonTitle(""); } }}>Add</Button>
            </div>
          ) : (
            <Button className="mt-3" variant="secondary" size="sm" onClick={() => setSectionId(section.id)}>Add lesson</Button>
          )}
        </Card>
      ))}
    </div>
  );
}

export function StudentRoster() {
  const { state, teacher } = useTeacher();
  const [query, setQuery] = useState("");
  if (!teacher) return null;
  const students = studentsForTeacher(state, teacher.id).filter((student) => student.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <PageHeader title="Students" description="People enrolled in a course you teach." />
      <Input aria-label="Search students" placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="overflow-auto rounded-3xl border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-paper-deep text-muted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Band</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-line bg-surface">
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">{student.gradeBand}</td>
                <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                <td className="px-4 py-3 text-right"><LinkButton href={routes.teacher.student(student.id)} size="sm" variant="secondary">Summary</LinkButton></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StudentSummary() {
  const params = useParams<{ studentId: string }>();
  const { state, teacher } = useTeacher();
  const student = studentById(state, params.studentId);
  if (!student || !teacher) return <EmptyState title="Student not found" body="They are not in this demo." />;
  const courseIds = new Set(state.courses.filter((course) => course.teacherId === teacher.id).map((course) => course.id));
  const enrollments = state.enrollments.filter((item) => item.studentId === student.id && courseIds.has(item.courseId));
  return (
    <div className="space-y-4">
      <PageHeader title={student.name} description={student.bio} />
      {enrollments.map((enrollment) => {
        const course = courseById(state, enrollment.courseId);
        return <Card key={enrollment.id}><h2 className="font-medium">{course?.title}</h2><p className="text-sm text-muted">{progressFor(state, student.id, enrollment.courseId)}% · {enrollment.status}</p></Card>;
      })}
    </div>
  );
}

export function ClassSchedule() {
  const { state, teacher } = useTeacher();
  if (!teacher) return null;
  const items = classesFor(state, "teacher", teacher.id).sort((a, b) => compareIso(b.start, a.start));
  return (
    <div className="space-y-4">
      <PageHeader title="Schedule" description="Date, length, course, and who is invited." actions={<LinkButton href={routes.teacher.newClass}>Schedule a class</LinkButton>} />
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <StatusBadge status={item.status} />
            <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
            <p className="text-sm text-muted">{formatDateTime(item.start)} · {item.durationMin} min · {item.recurring}</p>
          </div>
          <div className="flex gap-2">
            <LinkButton href={routes.teacher.classDetail(item.id)} size="sm" variant="secondary">Edit</LinkButton>
            <LinkButton href={routes.classroom(item.id)} size="sm">Room</LinkButton>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ClassForm({ mode }: { mode: "new" | "edit" }) {
  const params = useParams<{ classId: string }>();
  const { state, actions, teacher } = useTeacher();
  const router = useRouter();
  const toast = useToast();
  const existing = mode === "edit" ? state.classes.find((item) => item.id === params.classId) : undefined;
  const courses = state.courses.filter((course) => course.teacherId === teacher?.id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [courseId, setCourseId] = useState(existing?.courseId ?? courses[0]?.id ?? "");
  const [start, setStart] = useState(existing?.start.slice(0, 16) ?? "2026-11-12T16:00");
  const [duration, setDuration] = useState(String(existing?.durationMin ?? state.settings.defaultClassMinutes));
  const [recurring, setRecurring] = useState<"none" | "weekly">(existing?.recurring ?? "none");
  const [students, setStudents] = useState<string[]>(existing?.studentIds ?? []);
  const roster = useMemo(() => studentsForTeacher(state, teacher?.id ?? ""), [state, teacher?.id]);
  if (!teacher) return null;
  const save = () => {
    const payload = {
      title: title || "Untitled class",
      courseId,
      teacherId: teacher.id,
      studentIds: students,
      start: start.length === 16 ? `${start}:00` : start,
      durationMin: Number(duration) || 55,
      agenda: existing?.agenda ?? ["Open the board", "One careful example"],
      notes: existing?.notes ?? "",
      materialIds: existing?.materialIds ?? [],
      recurring,
      boardId: existing?.boardId,
    };
    if (existing) {
      actions.updateClass(existing.id, payload);
      toast({ title: "Class updated" });
    } else {
      const id = actions.createClass(payload);
      toast({ title: "Class scheduled", tone: "success" });
      router.push(routes.teacher.classDetail(id));
    }
  };
  return (
    <div className="max-w-xl space-y-4">
      <PageHeader title={existing ? "Edit class" : "Schedule a class"} description="Recurring means the demo will label it weekly. It does not create extra rows by itself." />
      <Field label="Title" htmlFor="class-title"><Input id="class-title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
      <Field label="Course" htmlFor="class-course">
        <Select id="class-course" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </Select>
      </Field>
      <Field label="Starts" htmlFor="start"><Input id="start" type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} /></Field>
      <Field label="Minutes" htmlFor="duration"><Input id="duration" value={duration} onChange={(event) => setDuration(event.target.value)} /></Field>
      <Field label="Repeats" htmlFor="repeat">
        <Select id="repeat" value={recurring} onChange={(event) => setRecurring(event.target.value as "none" | "weekly")}>
          <option value="none">Does not repeat</option>
          <option value="weekly">Weekly</option>
        </Select>
      </Field>
      <fieldset>
        <legend className="text-sm font-medium">Participants</legend>
        <div className="mt-2 grid gap-2">
          {roster.map((student) => (
            <label key={student.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={students.includes(student.id)} onChange={(event) => setStudents(event.target.checked ? [...students, student.id] : students.filter((id) => id !== student.id))} />
              {student.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Button onClick={save}>Save class</Button>
      {existing ? (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => actions.updateClass(existing.id, { status: "live" })}>Mark live</Button>
          <Button variant="secondary" onClick={() => actions.updateClass(existing.id, { status: "completed" })}>Mark completed</Button>
          <Button variant="ghost" onClick={() => actions.updateClass(existing.id, { status: "cancelled" })}>Cancel</Button>
        </div>
      ) : null}
    </div>
  );
}

export function LiveSessions() {
  const { state, teacher } = useTeacher();
  if (!teacher) return null;
  const groups = ["live", "scheduled", "completed", "cancelled"] as const;
  return (
    <div className="space-y-6">
      <PageHeader title="Live sessions" description="Rooms are simulated. Joining never opens a real call." />
      {groups.map((status) => (
        <section key={status}>
          <h2 className="font-serif text-2xl capitalize">{status}</h2>
          <div className="mt-3 grid gap-3">
            {state.classes.filter((item) => item.teacherId === teacher.id && item.status === status).map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-3">
                <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted">{formatDateTime(item.start)}</p></div>
                <LinkButton href={routes.classroom(item.id)} size="sm">Enter</LinkButton>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function AssignmentDesk() {
  const { state, teacher } = useTeacher();
  if (!teacher) return null;
  const items = state.assignments.filter((item) => item.teacherId === teacher.id);
  return (
    <div className="space-y-4">
      <PageHeader title="Assignments" description="Create work, then read what came back." actions={<LinkButton href={routes.teacher.newAssignment}>New assignment</LinkButton>} />
      {items.map((item) => (
        <Card key={item.id} className="flex items-center justify-between gap-3">
          <div>
            <StatusBadge status={item.status} />
            <h2 className="mt-2 font-medium">{item.title}</h2>
            <p className="text-sm text-muted">Due {formatDateTime(item.dueAt)}</p>
          </div>
          <LinkButton href={routes.teacher.assignment(item.id)} size="sm" variant="secondary">Review</LinkButton>
        </Card>
      ))}
    </div>
  );
}

export function NewAssignment() {
  const { state, actions, teacher } = useTeacher();
  const router = useRouter();
  const courses = state.courses.filter((course) => course.teacherId === teacher?.id && course.status !== "archived");
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [instructions, setInstructions] = useState("");
  const [due, setDue] = useState("2026-11-20T18:00");
  const [points, setPoints] = useState("15");
  if (!teacher) return null;
  return (
    <div className="max-w-xl space-y-4">
      <PageHeader title="New assignment" description="Students already enrolled receive a not-started submission." />
      <Field label="Title" htmlFor="a-title"><Input id="a-title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
      <Field label="Course" htmlFor="a-course"><Select id="a-course" value={courseId} onChange={(event) => setCourseId(event.target.value)}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</Select></Field>
      <Field label="Instructions" htmlFor="a-body"><Textarea id="a-body" value={instructions} onChange={(event) => setInstructions(event.target.value)} /></Field>
      <Field label="Due" htmlFor="a-due"><Input id="a-due" type="datetime-local" value={due} onChange={(event) => setDue(event.target.value)} /></Field>
      <Field label="Points" htmlFor="a-points"><Input id="a-points" value={points} onChange={(event) => setPoints(event.target.value)} /></Field>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => { const id = actions.createAssignment({ title, courseId, teacherId: teacher.id, dueAt: `${due}:00`, instructions, points: Number(points) || 10, status: "draft" }); router.push(routes.teacher.assignment(id)); }}>Save draft</Button>
        <Button onClick={() => { const id = actions.createAssignment({ title, courseId, teacherId: teacher.id, dueAt: `${due}:00`, instructions, points: Number(points) || 10, status: "open" }); router.push(routes.teacher.assignment(id)); }}>Publish</Button>
      </div>
    </div>
  );
}

export function ReviewAssignment() {
  const params = useParams<{ assignmentId: string }>();
  const { state, actions } = useTeacher();
  const toast = useToast();
  const assignment = state.assignments.find((item) => item.id === params.assignmentId);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, string>>({});
  if (!assignment) return <EmptyState title="Missing assignment" body="It is not in the demo." />;
  const submissions = state.submissions.filter((item) => item.assignmentId === assignment.id);
  return (
    <div className="space-y-4">
      <PageHeader title={assignment.title} description={assignment.instructions} actions={<Button variant="secondary" onClick={() => actions.updateAssignment(assignment.id, { status: assignment.status === "open" ? "closed" : "open" })}>{assignment.status === "open" ? "Close" : "Reopen"}</Button>} />
      {submissions.map((submission) => {
        const student = studentById(state, submission.studentId);
        return (
          <Card key={submission.id}>
            <div className="flex items-center justify-between"><h2 className="font-medium">{student?.name}</h2><StatusBadge status={submission.status} /></div>
            <p className="mt-2 text-sm text-ink-soft">{submission.body || "No writing yet."}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[8rem_1fr_auto]">
              <Input aria-label="Score" value={scores[submission.id] ?? (submission.score?.toString() ?? "")} onChange={(event) => setScores({ ...scores, [submission.id]: event.target.value })} />
              <Input aria-label="Feedback" value={feedback[submission.id] ?? submission.feedback ?? ""} onChange={(event) => setFeedback({ ...feedback, [submission.id]: event.target.value })} />
              <Button onClick={() => { actions.reviewSubmission(submission.id, Number(scores[submission.id] ?? submission.score ?? 0), feedback[submission.id] ?? submission.feedback ?? ""); toast({ title: "Returned", tone: "success" }); }}>Return</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function TeacherReviews() {
  const { state, teacher } = useTeacher();
  if (!teacher) return null;
  const reviews = state.reviews.filter((review) => review.teacherId === teacher.id);
  return (
    <div className="space-y-4">
      <PageHeader title="Reviews" description="Fictional notes left on your courses." />
      {reviews.map((review) => (
        <Card key={review.id}>
          <div className="flex gap-2"><Badge>{review.rating} / 5</Badge>{review.hidden ? <Badge tone="danger">Hidden</Badge> : null}</div>
          <h2 className="mt-2 font-medium">{review.title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{review.body}</p>
          <p className="mt-2 text-xs text-muted">{personById(state, review.studentId)?.name}</p>
        </Card>
      ))}
    </div>
  );
}

export function AvailabilityEditor() {
  const { actions, teacher } = useTeacher();
  const toast = useToast();
  const [days, setDays] = useState(teacher?.availability ?? []);
  if (!teacher) return null;
  const slots = ["Morning", "Afternoon", "Evening"];
  return (
    <div className="space-y-4">
      <PageHeader title="Availability" description="Students see this on your public profile." />
      <div className="grid gap-3">
        {days.map((day) => (
          <Card key={day.day}>
            <p className="font-medium">{day.day}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot) => {
                const on = day.slots.includes(slot);
                return (
                  <button key={slot} type="button" className={`rounded-full px-3 py-1 text-sm ${on ? "bg-teal text-paper" : "bg-paper-deep"}`} onClick={() => setDays(days.map((item) => item.day === day.day ? { ...item, slots: on ? item.slots.filter((value) => value !== slot) : [...item.slots, slot] } : item))}>{slot}</button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={() => { actions.updateTeacher(teacher.id, { availability: days }); toast({ title: "Availability saved", tone: "success" }); }}>Save hours</Button>
    </div>
  );
}

export function TeacherSettings() {
  const { actions, teacher } = useTeacher();
  const toast = useToast();
  const [location, setLocation] = useState(teacher?.location ?? "");
  const [rate, setRate] = useState(String(teacher?.hourlyRate ?? ""));
  if (!teacher) return null;
  return (
    <div className="max-w-xl space-y-4">
      <PageHeader title="Account" description="Studio details for the demo profile." />
      <Field label="Location" htmlFor="location"><Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} /></Field>
      <Field label="Displayed hourly rate" htmlFor="rate"><Input id="rate" value={rate} onChange={(event) => setRate(event.target.value)} /></Field>
      <Button onClick={() => { actions.updateTeacher(teacher.id, { location, hourlyRate: Number(rate) || teacher.hourlyRate }); toast({ title: "Account saved" }); }}>Save</Button>
    </div>
  );
}
