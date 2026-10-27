import Link from "next/link";
import type { Course } from "@/types";
import { Badge, Rating } from "@/components/ui/feedback";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";
import { routes } from "@/lib/routes";

const motifs: Record<Course["cover"]["motif"], string> = {
  arc: "M8 78c28-28 52-36 84-28",
  grid: "M12 20h96M12 40h96M12 60h96M28 8v80M52 8v80M76 8v80",
  leaf: "M70 78C40 60 28 30 48 12c28 8 40 36 22 66Z",
  orbit: "M60 46m-22 0a22 22 0 1 0 44 0a22 22 0 1 0-44 0M60 46m-8 0a8 8 0 1 0 16 0",
  wave: "M6 50c16 0 16-16 32-16s16 16 32 16 16-16 32-16",
};

export function CourseCover({ course, className }: { course: Course; className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(145deg, ${course.cover.from}, ${course.cover.to})` }}
      aria-hidden
    >
      <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full opacity-70">
        <path d={motifs[course.cover.motif]} fill="none" stroke="#2A5C56" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function CourseCard({
  course,
  teacherName,
  category,
}: {
  course: Course;
  teacherName: string;
  category: string;
}) {
  return (
    <Link
      href={routes.course(course.id)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <CourseCover course={course} className="h-36" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="teal">{category}</Badge>
          <Badge>{course.level}</Badge>
        </div>
        <div>
          <h3 className="font-serif text-xl tracking-tight text-ink group-hover:text-teal-deep">{course.title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{course.subtitle}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">{teacherName}</span>
          <Rating value={course.rating} count={course.reviewCount} />
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
          <span className="text-muted">{course.durationHours} hours</span>
          <span className="font-medium text-ink">{course.price === 0 ? "Included" : formatMoney(course.price)}</span>
        </div>
      </div>
    </Link>
  );
}
