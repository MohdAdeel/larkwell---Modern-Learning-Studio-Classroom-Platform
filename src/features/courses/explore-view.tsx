"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState, PageHeader } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/fields";
import { plural } from "@/lib/formatters";
import { categoryById, teacherById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";

export function ExploreView() {
  const params = useSearchParams();
  const router = useRouter();
  const { state } = useStore();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const category = params.get("category") ?? "all";
  const level = params.get("level") ?? "all";
  const price = params.get("price") ?? "all";
  const sort = params.get("sort") ?? "featured";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const search = next.toString();
    router.replace(search ? `${routes.explore}?${search}` : routes.explore, { scroll: false });
  };

  const courses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = state.courses.filter((course) => {
      if (course.status === "draft" || course.status === "archived") return false;
      if (category !== "all" && course.categoryId !== category) return false;
      if (level !== "all" && course.level !== level) return false;
      if (price === "included" && course.price !== 0) return false;
      if (price === "intensive" && course.price === 0) return false;
      if (!needle) return true;
      const teacher = teacherById(state, course.teacherId)?.name ?? "";
      return `${course.title} ${course.subtitle} ${teacher}`.toLowerCase().includes(needle);
    });
    return filtered.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      return b.enrolledCount - a.enrolledCount;
    });
  }, [category, level, price, query, sort, state]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Catalog"
        title="Courses with a person attached"
        description="Search the demo studio. Drafts stay in the teacher’s room. Archived courses stay out of this list."
      />
      <div className="mt-8 grid gap-3 md:grid-cols-[1.4fr_repeat(4,0.7fr)]">
        <Input
          aria-label="Search courses"
          placeholder="Search by course or teacher"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setParam("q", event.target.value);
          }}
        />
        <Select aria-label="Category" value={category} onChange={(event) => setParam("category", event.target.value)}>
          <option value="all">All subjects</option>
          {state.categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select aria-label="Level" value={level} onChange={(event) => setParam("level", event.target.value)}>
          <option value="all">All levels</option>
          <option>Foundations</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </Select>
        <Select aria-label="Price" value={price} onChange={(event) => setParam("price", event.target.value)}>
          <option value="all">Any price</option>
          <option value="included">Included</option>
          <option value="intensive">Intensive</option>
        </Select>
        <Select aria-label="Sort" value={sort} onChange={(event) => setParam("sort", event.target.value)}>
          <option value="featured">Most joined</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest</option>
          <option value="title">Title</option>
        </Select>
      </div>
      <p className="mt-4 text-sm text-muted">{plural(courses.length, "course")}</p>
      {courses.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nothing matches" body="Try another subject, or clear the search. The studio is intentionally small." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teacherName={teacherById(state, course.teacherId)?.name ?? "Teacher"}
              category={categoryById(state, course.categoryId)?.name ?? "Studio"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
