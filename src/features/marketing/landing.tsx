"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, PenLine, Video } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { LinkButton } from "@/components/ui/button";
import { categoryById, teacherById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { formatMoney } from "@/lib/formatters";
import { plans } from "@/data/dummy/subscriptions";

const steps = [
  {
    number: "01",
    title: "Choose a room, not a catalog dump",
    body: "Browse a short list of courses and the people who teach them. The point is a fit, not a pile of thumbnails.",
  },
  {
    number: "02",
    title: "Meet on a board you can keep",
    body: "The live hour has a classroom and a whiteboard with its own address. When the hour ends, the drawing stays with the lesson.",
  },
  {
    number: "03",
    title: "Leave with the thread intact",
    body: "Notes, assignments, and the next class sit beside the course, so Monday does not begin with a search.",
  },
];

const faqs = [
  {
    q: "Is this a real school?",
    a: "No. Larkwell here is a frontend studio you can click through. Teachers, students, classes, and payments are fictional records stored in this browser.",
  },
  {
    q: "Can someone else open a board link I copy?",
    a: "Only if they are using this same browser profile. A board link identifies a record in the local demo. It is not a live share across devices.",
  },
  {
    q: "Are the classes actually on video?",
    a: "The classroom is a careful simulation. Controls respond, and a camera preview can stay on your device, but nothing is sent to a call.",
  },
  {
    q: "What happens if I reset the demo?",
    a: "Reset demo data, in any studio settings page, clears this browser’s changes and restores the original records.",
  },
];

export function LandingView() {
  const { state } = useStore();
  const featured = state.courses.filter((course) => course.status === "published").slice(0, 3);
  const [open, setOpen] = useState(0);
  const studentPlans = plans.filter((plan) => plan.audience === "student");

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="animate-rise">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal">Live teaching, kept quiet</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
            The studio where a good lesson stays with you.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-ink-soft">
            Larkwell holds the live class, the whiteboard, and the notes in one calm place — for teachers who still like a board, and students who like to return to it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={routes.explore} size="lg">
              Browse the studio <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href={routes.signUp} variant="secondary" size="lg">
              Teach on Larkwell
            </LinkButton>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["11", "Teachers in the demo"],
              ["17", "Courses with real curricula"],
              ["1", "Board you can actually draw on"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-3xl text-ink">{value}</dt>
                <dd className="mt-1 text-xs leading-5 text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="animate-rise rounded-[2rem] border border-line bg-surface p-3 shadow-lift">
          <div className="rounded-[1.4rem] bg-paper p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-clay" /> Live · Quiet Calculus
              </span>
              <span>Demo room</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_0.8fr]">
              <div className="relative h-52 overflow-hidden rounded-2xl bg-[#e7f0ec]">
                <svg viewBox="0 0 320 200" className="h-full w-full">
                  <path d="M30 160 H290" stroke="#2A5C56" strokeWidth="2" />
                  <path d="M46 176 V28" stroke="#2A5C56" strokeWidth="2" />
                  <path d="M54 150 C 100 132, 140 90, 250 62" fill="none" stroke="#A56A4E" strokeWidth="3" />
                  <path d="M120 118 L210 70" stroke="#4C6C84" strokeWidth="2" />
                </svg>
                <p className="absolute bottom-3 left-3 text-xs text-teal-deep">board-limits-curve</p>
              </div>
              <div className="grid gap-2">
                {["Helen Marlowe", "Maya Ellison", "Owen Park"].map((name) => (
                  <div key={name} className="rounded-2xl border border-line bg-surface px-3 py-3 text-sm">
                    <p className="font-medium text-ink">{name}</p>
                    <p className="text-xs text-muted">{name.startsWith("Helen") ? "Speaking" : "Listening"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Video className="size-3.5" /> Simulated room
              <PenLine className="ml-2 size-3.5" /> Board stays after class
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-auto px-4 py-4 sm:px-6">
          {state.categories.map((category) => (
            <Link
              key={category.id}
              href={`${routes.explore}?category=${category.id}`}
              className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-teal hover:text-teal-deep"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal">How a lesson moves</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-serif text-4xl text-teal">{step.number}</p>
              <h2 className="mt-4 font-serif text-2xl tracking-tight">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <article className="rounded-[2rem] bg-sage-soft p-8">
          <h2 className="font-serif text-3xl tracking-tight">For teachers</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-ink-soft">
            {["Publish a course when it is ready, and keep a draft until it is.", "Schedule a class with a board and a short agenda.", "Read work without hunting through another app."].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal" /> {item}
              </li>
            ))}
          </ul>
          <LinkButton href={routes.teachers} variant="secondary" className="mt-6">
            Meet the teachers
          </LinkButton>
        </article>
        <article className="rounded-[2rem] bg-blue-soft p-8">
          <h2 className="font-serif text-3xl tracking-tight">For students</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-ink-soft">
            {["See the next hour before you need it.", "Return to the board, not a screenshot.", "Hand in work and read the note that comes back."].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-blue" /> {item}
              </li>
            ))}
          </ul>
          <LinkButton href={routes.explore} variant="secondary" className="mt-6">
            Explore courses
          </LinkButton>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight">In the studio now</h2>
          <Link href={routes.explore} className="text-sm text-teal">
            All courses
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teacherName={teacherById(state, course.teacherId)?.name ?? "Teacher"}
              category={categoryById(state, course.categoryId)?.name ?? "Studio"}
            />
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal">Fictional notes from the demo</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight">What the sample studio sounds like</h2>
          </div>
          <div className="grid gap-4">
            {[
              ["Helen draws the limit on the board, and I can still see it when I close the laptop.", "Maya Ellison", "Student"],
              ["I stopped keeping three tools open. The class, the board, and the notes live together.", "Jonah Adler", "Teacher"],
            ].map(([quote, name, role]) => (
              <blockquote key={name} className="rounded-3xl border border-line bg-paper p-6">
                <p className="font-serif text-2xl leading-snug text-ink">“{quote}”</p>
                <footer className="mt-4 text-sm text-muted">
                  {name} · {role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-serif text-3xl tracking-tight">Membership, plainly</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {studentPlans.map((plan) => (
            <article key={plan.id} className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-sm text-teal">{plan.recommended ? "Recommended" : "Student"}</p>
              <h3 className="mt-2 font-serif text-2xl">{plan.name}</h3>
              <p className="mt-2 font-serif text-4xl">{plan.monthly === 0 ? "Free" : formatMoney(plan.monthly)}</p>
              <p className="text-sm text-muted">{plan.monthly === 0 ? "No charge in the demo" : "per month, simulated"}</p>
              <LinkButton href={routes.pricing} variant="secondary" className="mt-5">
                Compare plans
              </LinkButton>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-3xl tracking-tight">Questions</h2>
        <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-surface">
          {faqs.map((faq, index) => (
            <div key={faq.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                <span className="font-medium">{faq.q}</span>
                <span className="text-muted">{open === index ? "–" : "+"}</span>
              </button>
              {open === index ? <p className="px-5 pb-4 text-sm leading-6 text-ink-soft">{faq.a}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
