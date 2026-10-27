"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, Badge, EmptyState, PageHeader, Rating } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/fields";
import { LinkButton } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { categoryById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { formatMoney } from "@/lib/formatters";

export function TeacherDirectory() {
  const { state } = useStore();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const subjects = Array.from(new Set(state.teachers.flatMap((teacher) => teacher.subjects))).sort();
  const teachers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.teachers
      .filter((teacher) => teacher.status === "active")
      .filter((teacher) => (subject === "all" ? true : teacher.subjects.includes(subject)))
      .filter((teacher) => (level === "all" ? true : teacher.levels.includes(level)))
      .filter((teacher) => !needle || `${teacher.name} ${teacher.headline} ${teacher.location}`.toLowerCase().includes(needle))
      .sort((a, b) => b.rating - a.rating);
  }, [level, query, state.teachers, subject]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="Teachers" title="People who still like a board" description="Every profile in this directory is a fictional demo teacher, with subjects, hours, and a way of teaching you can read before you join." />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <Input aria-label="Search teachers" placeholder="Search by name or city" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select aria-label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select aria-label="Level" value={level} onChange={(event) => setLevel(event.target.value)}>
          <option value="all">All levels</option>
          <option>Foundations</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </Select>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {teachers.length === 0 ? <EmptyState title="No teacher matches" body="Try a different subject. The demo studio is a small faculty on purpose." /> : null}
        {teachers.map((teacher) => (
          <Link key={teacher.id} href={routes.teacherProfile(teacher.id)} className="rounded-3xl border border-line bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex gap-4">
              <Avatar name={teacher.name} tone={teacher.avatarTone} size="lg" />
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={teacher.verification === "verified" ? "success" : "gold"}>{teacher.verification.replace("-", " ")}</Badge>
                  <Badge>{teacher.location}</Badge>
                </div>
                <h2 className="mt-2 font-serif text-2xl">{teacher.name}</h2>
                <p className="text-sm text-ink-soft">{teacher.headline}</p>
                <div className="mt-2">
                  <Rating value={teacher.rating} count={teacher.reviewCount} />
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{teacher.teachingStyle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TeacherProfile() {
  const params = useParams<{ teacherId: string }>();
  const { state } = useStore();
  const teacher = state.teachers.find((item) => item.id === params.teacherId);
  if (!teacher) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Teacher not found" body="That profile is not in the demo faculty." action={<LinkButton href={routes.teachers}>All teachers</LinkButton>} />
      </div>
    );
  }
  const courses = state.courses.filter((course) => course.teacherId === teacher.id && course.status === "published");
  const reviews = state.reviews.filter((review) => review.teacherId === teacher.id && !review.hidden);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="h-fit rounded-3xl border border-line bg-surface p-6">
          <Avatar name={teacher.name} tone={teacher.avatarTone} size="lg" />
          <h1 className="mt-4 font-serif text-4xl tracking-tight">{teacher.name}</h1>
          <p className="mt-2 text-ink-soft">{teacher.headline}</p>
          <div className="mt-3">
            <Rating value={teacher.rating} count={teacher.reviewCount} />
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div><dt className="text-muted">Subjects</dt><dd>{teacher.subjects.join(", ")}</dd></div>
            <div><dt className="text-muted">Levels</dt><dd>{teacher.levels.join(", ")}</dd></div>
            <div><dt className="text-muted">Languages</dt><dd>{teacher.languages.join(", ")}</dd></div>
            <div><dt className="text-muted">Based in</dt><dd>{teacher.location} · {teacher.timezone}</dd></div>
            <div><dt className="text-muted">Studio rate</dt><dd>{formatMoney(teacher.hourlyRate)} an hour, shown for the demo</dd></div>
          </dl>
        </aside>
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-3xl">How they teach</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink-soft">{teacher.bio}</p>
            <p className="mt-3 text-sm text-ink-soft">{teacher.teachingStyle}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {teacher.qualifications.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Availability</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {teacher.availability.map((day) => (
                <div key={day.day} className="rounded-2xl border border-line bg-surface p-3 text-sm">
                  <p className="font-medium">{day.day.slice(0, 3)}</p>
                  <p className="text-muted">{day.slots.length ? day.slots.join(", ") : "Resting"}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Courses</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} teacherName={teacher.name} category={categoryById(state, course.categoryId)?.name ?? "Studio"} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Fictional notes</h2>
            <div className="mt-4 grid gap-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-3xl border border-line bg-surface p-5">
                  <Rating value={review.rating} count={1} />
                  <h3 className="mt-2 font-medium">{review.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{review.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
