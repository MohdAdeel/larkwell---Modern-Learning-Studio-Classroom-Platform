"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toast";
import { helpArticles } from "@/data/dummy/help";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { isEmail, isRequired } from "@/lib/validators";

export function AboutView() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="About" title="A studio, not a feed" description="Larkwell is built for the hour when a teacher and a few students look at the same board." />
      <div className="mt-8 space-y-4 text-sm leading-7 text-ink-soft">
        <p>The name comes from a lark and a well: something that rises, and something that holds depth. The mark is two strokes over a horizon, a wing and a page at once.</p>
        <p>This website is a frontend demonstration. The faculty, the students, the invoices, and the classes were written for the demo. Nothing here enrolls you in a real course or charges a real card.</p>
        <p>If you are previewing the product, use the role switcher. Maya, Helen, and Irene each see a different studio.</p>
      </div>
    </div>
  );
}

export function HelpView() {
  const [query, setQuery] = useState("");
  const articles = helpArticles.filter((article) => `${article.title} ${article.body}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader title="Help center" description="Short answers about the demo studio." />
      <Input className="mt-6" aria-label="Search help" placeholder="Search help" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-6 space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <p className="text-xs uppercase tracking-[0.14em] text-teal">{article.category}</p>
            <h2 className="mt-2 font-serif text-2xl">{article.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{article.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ContactView() {
  const { actions, state } = useStore();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <PageHeader title="Contact the studio" description={`Messages become support tickets for Irene. Write to ${state.settings.supportEmail} in the story of the demo.`} />
      <div className="mt-6 grid gap-3">
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Field label="Name" htmlFor="contact-name"><Input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} /></Field>
        <Field label="Email" htmlFor="contact-email"><Input id="contact-email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        <Field label="Subject" htmlFor="contact-subject"><Input id="contact-subject" value={subject} onChange={(event) => setSubject(event.target.value)} /></Field>
        <Field label="Message" htmlFor="contact-body"><Textarea id="contact-body" value={body} onChange={(event) => setBody(event.target.value)} /></Field>
        <Button onClick={() => {
          if (!isRequired(name) || !isEmail(email) || !isRequired(subject) || !isRequired(body)) {
            setError("Add a name, a real-looking email, a subject, and a message.");
            return;
          }
          actions.addTicket({ userId: state.session.userId ?? "student-maya-01", subject, body: `${name} (${email}): ${body}`, priority: "normal", category: "Contact" });
          toast({ title: "Ticket opened", description: "Find it in the admin support queue.", tone: "success" });
          setSubject("");
          setBody("");
        }}>Send</Button>
      </div>
    </div>
  );
}

export function LegalView({ kind }: { kind: "privacy" | "terms" | "accessibility" }) {
  const copy = {
    privacy: {
      title: "Privacy",
      body: "This demo stores your changes in local storage on this browser. It does not send account data, card numbers, or camera video to a server. Clearing site data, or using Reset demo data, removes that local copy. The sample people in the studio are fictional.",
    },
    terms: {
      title: "Terms",
      body: "Larkwell in this build is a demonstration interface. Plans, invoices, and enrollments are simulated. Do not enter a real payment card you use elsewhere. Nothing on these pages forms a contract for teaching services.",
    },
    accessibility: {
      title: "Accessibility",
      body: "The studio aims for readable type, visible focus, labels on controls, and dialogs that close with Escape. Motion respects a reduced-motion setting. If a control fails you, write through the contact form and it will appear in the demo support queue.",
    },
  }[kind];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title={copy.title} description="Written for this demo, not as legal advice." />
      <p className="mt-6 text-sm leading-7 text-ink-soft">{copy.body}</p>
      <Link href={routes.contact} className="mt-6 inline-block text-sm text-teal">Contact the studio</Link>
    </div>
  );
}

export function SearchView() {
  const params = useSearchParams();
  const { state } = useStore();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const needle = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!needle) return [];
    return [
      ...state.courses.filter((course) => course.title.toLowerCase().includes(needle)).map((course) => ({ href: routes.course(course.id), label: course.title, kind: "Course" })),
      ...state.teachers.filter((teacher) => teacher.name.toLowerCase().includes(needle)).map((teacher) => ({ href: routes.teacherProfile(teacher.id), label: teacher.name, kind: "Teacher" })),
      ...state.materials.filter((material) => material.title.toLowerCase().includes(needle)).map((material) => ({ href: routes.material(material.id), label: material.title, kind: "Material" })),
    ];
  }, [needle, state.courses, state.materials, state.teachers]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Search" description="Courses, teachers, and materials in the demo." />
      <Input className="mt-6" aria-label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try calculus, Helen, or market" />
      <div className="mt-6 space-y-2">
        {results.map((result) => (
          <LinkButton key={result.href} href={result.href} variant="secondary" className="w-full justify-between">
            <span>{result.label}</span><span className="text-muted">{result.kind}</span>
          </LinkButton>
        ))}
        {needle && results.length === 0 ? <p className="text-sm text-muted">Nothing matched.</p> : null}
      </div>
    </div>
  );
}
