"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import { BarList, LineChart } from "@/components/charts/charts";
import { useConfirm } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { analytics } from "@/data/dummy/analytics";
import { plans } from "@/data/dummy/subscriptions";
import { formatDate, formatMoney } from "@/lib/formatters";
import { courseById, personById, teacherById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

export function AdminDashboard() {
  const { state } = useStore();
  const live = state.classes.filter((item) => item.status === "live").length;
  const activeSubs = state.subscriptions.filter((item) => item.status === "active" || item.status === "trialing").length;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Steward" title="The studio at a glance" description="Counts update as you change the demo. The chart is a sample year." />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Students", state.students.length],
          ["Teachers", state.teachers.length],
          ["Courses", state.courses.length],
          ["Live now", live],
          ["Memberships", activeSubs],
          ["Open tickets", state.tickets.filter((ticket) => ticket.status !== "resolved").length],
        ].map(([label, value]) => (
          <Card key={String(label)}><p className="text-sm text-muted">{label}</p><p className="font-serif text-3xl">{value}</p></Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-3 font-serif text-2xl">Sessions this year</h2>
        <LineChart points={analytics.map((point) => point.sessions)} labels={analytics.map((point) => point.label)} />
      </Card>
    </div>
  );
}

export function AdminStudents() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = state.students.filter((student) => (status === "all" || student.status === status) && student.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <PageHeader title="Students" description="Search, filter, and change status. Suspending asks first." />
      <div className="grid gap-2 md:grid-cols-2">
        <Input aria-label="Search students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        <Select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">active</option>
          <option value="invited">invited</option>
          <option value="suspended">suspended</option>
        </Select>
      </div>
      <div className="overflow-auto rounded-3xl border border-line">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="bg-paper-deep text-muted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Band</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>
            {rows.map((student) => (
              <tr key={student.id} className="border-t border-line bg-surface">
                <td className="px-4 py-3">{student.name}<div className="text-xs text-muted">{student.email}</div></td>
                <td className="px-4 py-3">{student.gradeBand}</td>
                <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={routes.admin.student(student.id)} size="sm" variant="secondary">Profile</LinkButton>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    const next = student.status === "suspended" ? "active" : "suspended";
                    const ok = await confirm({ title: `${next === "suspended" ? "Suspend" : "Restore"} ${student.name}?`, body: "This only changes the demo record.", confirmLabel: next === "suspended" ? "Suspend" : "Restore", tone: next === "suspended" ? "danger" : "default" });
                    if (ok) actions.setStudentStatus(student.id, next);
                  }}>{student.status === "suspended" ? "Restore" : "Suspend"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminStudent() {
  const params = useParams<{ studentId: string }>();
  const { state } = useStore();
  const student = state.students.find((item) => item.id === params.studentId);
  if (!student) return <EmptyState title="No such student" body="The id is not in the demo." />;
  const enrollments = state.enrollments.filter((item) => item.studentId === student.id);
  return (
    <div className="space-y-4">
      <PageHeader title={student.name} description={student.bio} />
      <Card><p>{student.email}</p><p className="text-sm text-muted">{student.gradeBand} · {student.timezone}</p><div className="mt-2"><StatusBadge status={student.status} /></div></Card>
      {enrollments.map((item) => <Card key={item.id}>{courseById(state, item.courseId)?.title} · {item.status}</Card>)}
    </div>
  );
}

export function AdminTeachers() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const toast = useToast();
  const [verification, setVerification] = useState("all");
  const rows = state.teachers.filter((teacher) => verification === "all" || teacher.verification === verification);
  return (
    <div className="space-y-4">
      <PageHeader title="Teachers" description="Review profiles and record an approval decision in the demo." />
      <Select aria-label="Verification" value={verification} onChange={(event) => setVerification(event.target.value)}>
        <option value="all">All</option>
        <option value="verified">verified</option>
        <option value="pending">pending</option>
        <option value="needs-info">needs-info</option>
      </Select>
      {rows.map((teacher) => (
        <Card key={teacher.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusBadge status={teacher.verification} />
            <h2 className="mt-2 font-serif text-2xl">{teacher.name}</h2>
            <p className="text-sm text-muted">{teacher.headline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={routes.admin.teacher(teacher.id)} size="sm" variant="secondary">Review</LinkButton>
            <Button size="sm" onClick={async () => {
              const ok = await confirm({ title: `Verify ${teacher.name}?`, body: "Their public badge becomes verified in this browser." , confirmLabel: "Verify" });
              if (ok) { actions.setTeacherVerification(teacher.id, "verified"); toast({ title: "Marked verified" }); }
            }}>Approve</Button>
            <Button size="sm" variant="secondary" onClick={() => actions.setTeacherVerification(teacher.id, "needs-info")}>Ask for info</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminTeacher() {
  const params = useParams<{ teacherId: string }>();
  const { state } = useStore();
  const teacher = teacherById(state, params.teacherId);
  if (!teacher) return <EmptyState title="Teacher not found" body="Check the faculty list." />;
  return (
    <div className="space-y-3">
      <PageHeader title={teacher.name} description={teacher.bio} />
      <Card><StatusBadge status={teacher.verification} /><p className="mt-2 text-sm">{teacher.qualifications.join(" · ")}</p><p className="text-sm text-muted">{teacher.yearsExperience} years · {teacher.location}</p></Card>
    </div>
  );
}

export function AdminCourses() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const [status, setStatus] = useState("all");
  const rows = state.courses.filter((course) => status === "all" || course.status === status);
  return (
    <div className="space-y-4">
      <PageHeader title="Courses" description="Publishing status and a moderation control." />
      <Select aria-label="Publishing status" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="all">All</option>
        {["draft", "in-review", "published", "archived"].map((item) => <option key={item}>{item}</option>)}
      </Select>
      {rows.map((course) => (
        <Card key={course.id} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <StatusBadge status={course.status} />
            <h2 className="mt-2 font-medium">{course.title}</h2>
            <p className="text-sm text-muted">{teacherById(state, course.teacherId)?.name} · {state.categories.find((item) => item.id === course.categoryId)?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => actions.updateCourse(course.id, { status: "published" })}>Publish</Button>
            <Button size="sm" variant="secondary" onClick={async () => {
              const ok = await confirm({ title: "Archive course?", body: course.title, confirmLabel: "Archive", tone: "danger" });
              if (ok) actions.updateCourse(course.id, { status: "archived" });
            }}>Archive</Button>
            {course.status === "in-review" ? <Button size="sm" variant="ghost" onClick={() => actions.updateCourse(course.id, { status: "draft" })}>Return to draft</Button> : null}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminClasses() {
  const { state, actions } = useStore();
  const [status, setStatus] = useState("all");
  const rows = state.classes.filter((item) => status === "all" || item.status === status);
  return (
    <div className="space-y-4">
      <PageHeader title="Live classes" description="Scheduled and active sessions across the studio." />
      <Select aria-label="Class status" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="all">All</option>
        {["scheduled", "live", "completed", "cancelled"].map((item) => <option key={item}>{item}</option>)}
      </Select>
      {rows.map((item) => (
        <Card key={item.id} className="flex items-center justify-between gap-3">
          <div><StatusBadge status={item.status} /><h2 className="mt-2 font-medium">{item.title}</h2><p className="text-sm text-muted">{formatDate(item.start)} · {teacherById(state, item.teacherId)?.name}</p></div>
          <div className="flex gap-2">
            <LinkButton href={routes.classroom(item.id)} size="sm" variant="secondary">Room</LinkButton>
            <Button size="sm" variant="ghost" onClick={() => actions.updateClass(item.id, { status: "cancelled" })}>Cancel</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminContent() {
  const { state, actions } = useStore();
  const [tab, setTab] = useState<"boards" | "materials" | "reviews">("boards");
  return (
    <div className="space-y-4">
      <PageHeader title="Content" description="Boards, materials, and reviews a steward can see." />
      <div className="flex gap-2">
        {(["boards", "materials", "reviews"] as const).map((item) => <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>)}
      </div>
      {tab === "boards" ? state.boards.map((board) => (
        <Card key={board.id} className="flex items-center justify-between"><div><p className="text-xs text-muted">{board.id}</p><p>{board.title}</p></div><LinkButton href={routes.whiteboard(board.id)} size="sm">Open</LinkButton></Card>
      )) : null}
      {tab === "materials" ? state.materials.map((material) => (
        <Card key={material.id} className="flex items-center justify-between"><div><p>{material.title}</p><p className="text-xs text-muted">{material.visibility}</p></div><LinkButton href={routes.material(material.id)} size="sm" variant="secondary">Preview</LinkButton></Card>
      )) : null}
      {tab === "reviews" ? state.reviews.map((review) => (
        <Card key={review.id} className="flex items-center justify-between gap-3"><div><p className="font-medium">{review.title}</p><p className="text-sm text-muted">{review.body}</p></div><Button size="sm" variant="secondary" onClick={() => actions.setReviewHidden(review.id, !review.hidden)}>{review.hidden ? "Show" : "Hide"}</Button></Card>
      )) : null}
    </div>
  );
}

export function AdminBilling() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  return (
    <div className="space-y-4">
      <PageHeader title="Subscriptions" description="Mock invoices. Refunds are labels, not transfers." />
      <div className="overflow-auto rounded-3xl border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-paper-deep"><tr><th className="px-4 py-3">Person</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody>
            {state.subscriptions.map((item) => (
              <tr key={item.id} className="border-t border-line bg-surface">
                <td className="px-4 py-3">{personById(state, item.userId)?.name}</td>
                <td className="px-4 py-3">{plans.find((plan) => plan.id === item.planId)?.name} · {item.interval}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state.invoices.map((invoice) => (
        <Card key={invoice.id} className="flex items-center justify-between gap-3">
          <div><p>{invoice.description}</p><p className="text-sm text-muted">{personById(state, invoice.userId)?.name} · {formatMoney(invoice.amount)}</p></div>
          <div className="flex items-center gap-2">
            <StatusBadge status={invoice.status} />
            {invoice.status === "paid" ? <Button size="sm" variant="ghost" onClick={async () => {
              const ok = await confirm({ title: "Mark refunded?", body: "The ledger label changes. No money moves.", confirmLabel: "Mark refunded", tone: "danger" });
              if (ok) actions.setInvoiceStatus(invoice.id, "refunded");
            }}>Refund</Button> : null}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminAnalytics() {
  const { state } = useStore();
  const download = () => {
    const header = "month,students,teachers,revenue,sessions";
    const lines = analytics.map((point) => [point.label, point.students, point.teachers, point.revenue, point.sessions].join(","));
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "larkwell-demo-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-4">
      <PageHeader title="Reports" description="A sample year, plus live counts from the records you can edit." actions={<Button onClick={download}>Download CSV</Button>} />
      <Card><h2 className="mb-3 font-serif text-2xl">Revenue sample</h2><LineChart points={analytics.map((point) => point.revenue)} labels={analytics.map((point) => point.label)} /></Card>
      <Card><BarList items={state.categories.map((category) => ({ label: category.name, value: state.courses.filter((course) => course.categoryId === category.id).length, hint: `${state.courses.filter((course) => course.categoryId === category.id).length} courses` }))} /></Card>
    </div>
  );
}

export function AdminCategories() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="space-y-4">
      <PageHeader title="Subjects" description="Categories used by the course catalog." />
      <Card>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <Input aria-label="Name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input aria-label="Description" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <Button onClick={() => { if (!name.trim()) return; actions.addCategory(name.trim(), description.trim()); setName(""); setDescription(""); toast({ title: "Subject added" }); }}>Add</Button>
        </div>
      </Card>
      {state.categories.map((category) => (
        <Card key={category.id} className="flex items-center justify-between gap-3">
          <div><h2 className="font-medium">{category.name}</h2><p className="text-sm text-muted">{category.description}</p></div>
          <Button size="sm" variant="ghost" onClick={() => { const removed = actions.deleteCategory(category.id); toast({ title: removed ? "Removed" : "Still used by a course", tone: removed ? "success" : "warning" }); }}>Delete</Button>
        </Card>
      ))}
    </div>
  );
}

export function AdminAnnouncements() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "students" | "teachers">("all");
  return (
    <div className="space-y-4">
      <PageHeader title="Announcements" description="Published notes appear in student and teacher notification lists." />
      <Card>
        <div className="grid gap-3">
          <Field label="Title" htmlFor="an-title"><Input id="an-title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="Body" htmlFor="an-body"><Textarea id="an-body" value={body} onChange={(event) => setBody(event.target.value)} /></Field>
          <Field label="Audience" htmlFor="an-audience"><Select id="an-audience" value={audience} onChange={(event) => setAudience(event.target.value as typeof audience)}><option value="all">Everyone</option><option value="students">Students</option><option value="teachers">Teachers</option></Select></Field>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => actions.addAnnouncement({ title, body, audience, authorId: "admin-irene-01", status: "draft" })}>Save draft</Button>
            <Button onClick={() => actions.addAnnouncement({ title, body, audience, authorId: "admin-irene-01", status: "published" })}>Publish</Button>
          </div>
        </div>
      </Card>
      {state.announcements.map((item) => (
        <Card key={item.id} className="flex items-start justify-between gap-3">
          <div><StatusBadge status={item.status} /><h2 className="mt-2 font-medium">{item.title}</h2><p className="text-sm text-muted">{item.body}</p></div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => actions.updateAnnouncement(item.id, { status: item.status === "published" ? "draft" : "published" })}>{item.status === "published" ? "Unpublish" : "Publish"}</Button>
            <Button size="sm" variant="ghost" onClick={async () => { const ok = await confirm({ title: "Delete announcement?", body: item.title, confirmLabel: "Delete", tone: "danger" }); if (ok) actions.deleteAnnouncement(item.id); }}>Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminSupport() {
  const { state } = useStore();
  const [status, setStatus] = useState("all");
  const rows = state.tickets.filter((ticket) => status === "all" || ticket.status === status);
  return (
    <div className="space-y-4">
      <PageHeader title="Support" description="Requests from the demo studio." />
      <Select aria-label="Ticket status" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="all">All</option>
        <option value="open">open</option>
        <option value="waiting">waiting</option>
        <option value="resolved">resolved</option>
      </Select>
      {rows.map((ticket) => (
        <Card key={ticket.id} className="flex items-center justify-between gap-3">
          <div><StatusBadge status={ticket.priority} /><h2 className="mt-2 font-medium">{ticket.subject}</h2><p className="text-sm text-muted">{personById(state, ticket.userId)?.name} · {ticket.category}</p></div>
          <LinkButton href={routes.admin.ticket(ticket.id)} size="sm">Open</LinkButton>
        </Card>
      ))}
    </div>
  );
}

export function AdminTicket() {
  const params = useParams<{ ticketId: string }>();
  const { state, actions } = useStore();
  const [reply, setReply] = useState("");
  const ticket = state.tickets.find((item) => item.id === params.ticketId);
  if (!ticket) return <EmptyState title="Ticket missing" body="It is not in the queue." />;
  return (
    <div className="space-y-4">
      <PageHeader title={ticket.subject} description={ticket.body} />
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => actions.updateTicket(ticket.id, { status: "waiting" })}>Waiting</Button>
        <Button size="sm" onClick={() => actions.updateTicket(ticket.id, { status: "resolved" })}>Resolve</Button>
      </div>
      {ticket.replies.map((item) => <Card key={item.id}><p className="text-xs text-muted">{personById(state, item.authorId)?.name}</p><p className="mt-1 text-sm">{item.body}</p></Card>)}
      <Field label="Reply" htmlFor="reply"><Textarea id="reply" value={reply} onChange={(event) => setReply(event.target.value)} /></Field>
      <Button onClick={() => { if (!reply.trim()) return; actions.replyTicket(ticket.id, "admin-irene-01", reply.trim()); setReply(""); }}>Send reply</Button>
    </div>
  );
}

export function AdminSettings() {
  const { state, actions } = useStore();
  const toast = useToast();
  const [settings, setSettings] = useState(state.settings);
  return (
    <div className="max-w-xl space-y-4">
      <PageHeader title="Platform settings" description="These switches affect the demo only." />
      <Field label="Support email" htmlFor="support"><Input id="support" value={settings.supportEmail} onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })} /></Field>
      <Field label="Default class length" htmlFor="minutes"><Input id="minutes" value={settings.defaultClassMinutes} onChange={(event) => setSettings({ ...settings, defaultClassMinutes: Number(event.target.value) || 55 })} /></Field>
      <Field label="Banner" htmlFor="banner" hint="Shown across studios when it is not empty."><Input id="banner" value={settings.banner} onChange={(event) => setSettings({ ...settings, banner: event.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.signupsOpen} onChange={(event) => setSettings({ ...settings, signupsOpen: event.target.checked })} /> Signups open</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.teacherReviewRequired} onChange={(event) => setSettings({ ...settings, teacherReviewRequired: event.target.checked })} /> Teachers need review before a public badge</label>
      <Button onClick={() => { actions.updateSettings(settings); toast({ title: "Settings saved", tone: "success" }); }}>Save configuration</Button>
    </div>
  );
}
