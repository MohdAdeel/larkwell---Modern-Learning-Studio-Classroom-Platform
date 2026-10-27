"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/ui/feedback";
import { brand } from "@/config/brand";
import { daysInMonth, formatDate, shiftMonth, weekdayIndex } from "@/lib/formatters";
import { classesFor, courseById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import type { Role } from "@/types";

export function CalendarView() {
  const { state } = useStore();
  const role: Role = state.session.role === "teacher" || state.session.role === "admin" ? state.session.role : "student";
  const userId = state.session.userId ?? "";
  const items = role === "admin" ? state.classes : classesFor(state, role === "teacher" ? "teacher" : "student", userId);
  const [cursor, setCursor] = useState({ year: 2026, month: 10 });
  const [selected, setSelected] = useState<string>(brand.demoToday);
  const count = daysInMonth(cursor.year, cursor.month);
  const start = weekdayIndex(`${cursor.year}-${String(cursor.month).padStart(2, "0")}-01`);
  const cells = [...Array.from({ length: start }, () => ""), ...Array.from({ length: count }, (_, index) => String(index + 1))];
  const dayIso = (day: string) => `${cursor.year}-${String(cursor.month).padStart(2, "0")}-${day.padStart(2, "0")}`;
  const selectedItems = items.filter((item) => item.start.slice(0, 10) === selected);

  return (
    <div className="space-y-4">
      <PageHeader title="Calendar" description={`The sample studio is anchored to ${formatDate(brand.demoNow)}, so the prepared classes stay in view.`} actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}>Previous</Button>
          <Button variant="secondary" onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}>Next</Button>
        </div>
      } />
      <p className="font-serif text-2xl">{formatDate(`${cursor.year}-${String(cursor.month).padStart(2, "0")}-01`).replace(/ \d+,/, "")}</p>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          const iso = day ? dayIso(day) : "";
          const countForDay = day ? items.filter((item) => item.start.slice(0, 10) === iso).length : 0;
          return (
            <button key={`${day}-${index}`} type="button" disabled={!day} onClick={() => day && setSelected(iso)} className={`min-h-16 rounded-2xl border p-2 text-left text-sm ${iso === selected ? "border-teal bg-teal-soft" : "border-line bg-surface"}`}>
              <span>{day}</span>
              {countForDay ? <span className="mt-2 block text-xs text-teal">{countForDay} class</span> : null}
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {selectedItems.length === 0 ? <p className="text-sm text-muted">No classes on this day.</p> : null}
        {selectedItems.map((item) => (
          <Link key={item.id} href={routes.classroom(item.id)} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
            <span>{item.title} · {courseById(state, item.courseId)?.title}</span>
            <StatusBadge status={item.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
