"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { adminNav, studentNav, teacherNav, type NavItem } from "@/components/layout/navigation";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { Avatar, Badge } from "@/components/ui/feedback";
import { LinkButton } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { personById, unreadCount } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { Role } from "@/types";

const navFor: Record<Role, NavItem[]> = {
  student: studentNav,
  teacher: teacherNav,
  admin: adminNav,
};

export function StudioFrame({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const sessionRole = state.session.role === "guest" ? null : state.session.role;
  const expected = role ?? sessionRole ?? "student";
  const allowed = !role || state.session.role === role;
  const person = state.session.userId ? personById(state, state.session.userId) : undefined;
  const nav = navFor[expected];
  const unread = state.session.userId ? unreadCount(state, state.session.userId) : 0;
  const inverse = expected === "admin";

  const aside = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Link href={routes.home} aria-label="Larkwell home">
          <Logo tone={inverse ? "inverse" : "default"} />
        </Link>
        <p className={cn("mt-3 text-xs uppercase tracking-[0.16em]", inverse ? "text-paper/70" : "text-muted")}>
          {expected === "admin" ? "Steward" : expected === "teacher" ? "Teaching studio" : "Learning studio"}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-auto px-3" aria-label="Studio">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== routes.calendar && item.href !== routes.messages && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          const showBadge = item.label === "Notifications" && unread > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                inverse
                  ? active
                    ? "bg-paper text-ink"
                    : "text-paper/80 hover:bg-white/10"
                  : active
                    ? "bg-teal-soft text-teal-deep"
                    : "text-ink-soft hover:bg-paper-deep",
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {showBadge ? <Badge tone="clay">{unread}</Badge> : null}
            </Link>
          );
        })}
      </nav>
      <div className={cn("space-y-3 border-t p-4", inverse ? "border-white/10" : "border-line")}>
        {person ? (
          <div className="flex items-center gap-3">
            <Avatar name={person.name} tone={person.tone} />
            <div className="min-w-0">
              <p className={cn("truncate text-sm font-medium", inverse ? "text-paper" : "text-ink")}>{person.name}</p>
              <p className={cn("truncate text-xs", inverse ? "text-paper/70" : "text-muted")}>{person.email}</p>
            </div>
          </div>
        ) : null}
        <RoleSwitcher id={`studio-role-${expected}`} />
        <button
          type="button"
          className={cn("text-xs underline-offset-2 hover:underline", inverse ? "text-paper/80" : "text-muted")}
          onClick={async () => {
            const ok = await confirm({
              title: "Reset the demo?",
              body: "This clears changes saved in this browser and restores the original studio.",
              confirmLabel: "Reset demo",
              tone: "danger",
            });
            if (!ok) return;
            actions.resetDemo();
            toast({ title: "Demo restored", description: "The original Larkwell records are back." });
          }}
        >
          Reset demo data
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen", inverse ? "bg-paper" : "bg-paper")}>
      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className={cn("sticky top-0 hidden h-screen lg:block", inverse ? "bg-teal-deep" : "border-r border-line bg-surface")}>
          {aside}
        </aside>
        <div className="min-w-0">
          <div className={cn("flex items-center justify-between border-b px-4 py-3 lg:hidden", inverse ? "border-line bg-teal-deep text-paper" : "border-line bg-surface")}>
            <Logo tone={inverse ? "inverse" : "default"} />
            <button type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)} className="inline-flex size-10 items-center justify-center rounded-full border border-current/20">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
          {open ? (
            <div className={cn("lg:hidden", inverse ? "bg-teal-deep" : "border-b border-line bg-surface")}>{aside}</div>
          ) : null}
          {state.settings.banner ? (
            <p className="border-b border-gold/30 bg-gold-soft px-4 py-2 text-sm text-ink-soft sm:px-8">{state.settings.banner}</p>
          ) : null}
          <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {allowed ? (
              children
            ) : (
              <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface p-8 text-center shadow-soft">
                <h1 className="font-serif text-3xl text-ink">This room is for {expected}s</h1>
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  Preview the studio as a {expected} to walk through this workspace. No account is created.
                </p>
                <div className="mt-5">
                  <RoleSwitcher id="gate-role" />
                </div>
                <LinkButton href={routes.home} className="mt-4">
                  Back to the public studio
                </LinkButton>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
