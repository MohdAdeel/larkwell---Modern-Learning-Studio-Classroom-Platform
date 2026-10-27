"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CourseCover } from "@/components/courses/course-card";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge, DemoNote, EmptyState, PageFallback, Rating, StatusBadge } from "@/components/ui/feedback";
import { useToast } from "@/components/ui/toast";
import { formatMoney, plural } from "@/lib/formatters";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  categoryById,
  enrollmentFor,
  lessonsForSection,
  sectionsForCourse,
  teacherById,
} from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

export function CourseDetail() {
  const params = useParams<{ courseId: string }>();
  const hydrated = useHydrated();
  const { state, actions } = useStore();
  const toast = useToast();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const course = state.courses.find((item) => item.id === params.courseId);

  if (!course && !hydrated) return <PageFallback label="Opening the course" />;
  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="This course is not in the demo" body="The link does not match a course stored in this browser." action={<LinkButton href={routes.explore}>Back to courses</LinkButton>} />
      </div>
    );
  }

  const teacher = teacherById(state, course.teacherId);
  const category = categoryById(state, course.categoryId);
  const sections = sectionsForCourse(state, course.id);
  const reviews = state.reviews.filter((review) => review.courseId === course.id && !review.hidden);
  const studentId = state.session.role === "student" ? state.session.userId : null;
  const enrollment = studentId ? enrollmentFor(state, studentId, course.id) : undefined;
  const activeSection = openSection ?? sections[0]?.id ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <CourseCover course={course} className="h-56 rounded-[2rem]" />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="teal">{category?.name}</Badge>
            <Badge>{course.level}</Badge>
            <StatusBadge status={course.status} />
          </div>
          <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-soft">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            {teacher ? (
              <Link href={routes.teacherProfile(teacher.id)} className="font-medium text-teal-deep">
                {teacher.name}
              </Link>
            ) : null}
            <Rating value={course.rating} count={course.reviewCount} />
            <span className="text-muted">{plural(course.enrolledCount, "student")}</span>
          </div>
        </div>
        <aside className="h-fit rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="font-serif text-4xl">{course.price === 0 ? "Included" : formatMoney(course.price)}</p>
          <p className="mt-1 text-sm text-muted">{course.price === 0 ? "With a Studio or Conservatory membership" : "Intensive, billed inside the demo only"}</p>
          <p className="mt-4 text-sm text-ink-soft">{course.durationHours} hours · {course.language}</p>
          {course.status === "archived" || course.status === "draft" || course.status === "in-review" ? (
            <DemoNote>This course is {course.status.replace("-", " ")} and is not open for new enrollment.</DemoNote>
          ) : enrollment ? (
            <LinkButton href={routes.student.course(course.id)} className="mt-5 w-full">
              Continue learning
            </LinkButton>
          ) : (
            <Button
              className="mt-5 w-full"
              onClick={() => {
                const id = studentId ?? "student-maya-01";
                if (!studentId) actions.signIn("student", id);
                const created = actions.enroll(id, course.id);
                toast({
                  title: created ? "You are enrolled" : "Already enrolled",
                  description: studentId ? "The course is in your studio." : "Continued as Maya Ellison in this demo.",
                  tone: "success",
                });
              }}
            >
              {studentId ? "Enroll" : "Enroll as Maya"}
            </Button>
          )}
          <ul className="mt-5 space-y-2 text-sm text-ink-soft">
            {course.outcomes.map((outcome) => (
              <li key={outcome}>· {outcome}</li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-3xl">Curriculum</h2>
        <div className="mt-4 divide-y divide-line rounded-3xl border border-line bg-surface">
          {sections.map((section) => (
            <div key={section.id}>
              <button type="button" className="flex w-full items-center justify-between px-5 py-4 text-left" aria-expanded={activeSection === section.id} onClick={() => setOpenSection(section.id)}>
                <span className="font-medium">{section.title}</span>
                <span className="text-sm text-muted">{lessonsForSection(state, section.id).length} lessons</span>
              </button>
              {activeSection === section.id ? (
                <ul className="space-y-3 px-5 pb-5">
                  {lessonsForSection(state, section.id).map((lesson) => (
                    <li key={lesson.id} className="flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="font-medium text-ink">{lesson.title}</p>
                        <p className="text-ink-soft">{lesson.summary}</p>
                      </div>
                      <span className="shrink-0 text-muted">{lesson.durationMin} min · {lesson.type}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {teacher ? (
        <section className="mt-12 rounded-3xl border border-line bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-teal">Teacher</p>
          <h2 className="mt-2 font-serif text-3xl">{teacher.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">{teacher.bio}</p>
          <LinkButton href={routes.teacherProfile(teacher.id)} variant="secondary" className="mt-4">
            View profile
          </LinkButton>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-serif text-3xl">Notes from the demo</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reviews.length === 0 ? <EmptyState title="No public notes yet" body="Reviews appear here after a student writes one in the studio." /> : null}
          {reviews.map((review) => {
            const student = state.students.find((item) => item.id === review.studentId);
            return (
              <article key={review.id} className="rounded-3xl border border-line bg-surface p-5">
                <Rating value={review.rating} count={1} />
                <h3 className="mt-2 font-medium">{review.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{review.body}</p>
                <p className="mt-3 text-xs text-muted">{student?.name} · fictional demo note</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
