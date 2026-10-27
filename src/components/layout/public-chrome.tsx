"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { LinkButton } from "@/components/ui/button";
import { useStore } from "@/lib/mock-store";
import { homeForRole, routes } from "@/lib/routes";

const links = [
  { href: routes.explore, label: "Courses" },
  { href: routes.teachers, label: "Teachers" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.about, label: "About" },
  { href: routes.help, label: "Help" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { state } = useStore();
  const studio = homeForRole(state.session.role);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={routes.home} aria-label="Larkwell home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-soft lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-56">
            <RoleSwitcher id="header-role" />
          </div>
          <Link href={routes.signIn} className="text-sm text-ink-soft hover:text-ink">
            Sign in
          </Link>
          <LinkButton href={state.session.role === "guest" ? routes.signUp : studio}>
            {state.session.role === "guest" ? "Join the studio" : "Enter studio"}
          </LinkButton>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="space-y-4 border-t border-line px-4 py-4 lg:hidden">
          <nav className="grid gap-2 text-sm" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-2 py-2 hover:bg-paper-deep">
                {link.label}
              </Link>
            ))}
          </nav>
          <RoleSwitcher id="mobile-role" />
          <div className="flex gap-2">
            <LinkButton href={routes.signIn} variant="secondary" className="flex-1">
              Sign in
            </LinkButton>
            <LinkButton href={routes.signUp} className="flex-1">
              Join
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            A quieter studio for live teaching. Larkwell in this build is a frontend demo. People, classes, and payments are fictional and stay in your browser.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Studio</p>
          <ul className="mt-3 grid gap-2 text-sm text-ink-soft">
            <li><Link href={routes.explore}>Courses</Link></li>
            <li><Link href={routes.teachers}>Teachers</Link></li>
            <li><Link href={routes.pricing}>Pricing</Link></li>
            <li><Link href={routes.about}>About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Care</p>
          <ul className="mt-3 grid gap-2 text-sm text-ink-soft">
            <li><Link href={routes.help}>Help center</Link></li>
            <li><Link href={routes.contact}>Contact</Link></li>
            <li><Link href={routes.privacy}>Privacy</Link></li>
            <li><Link href={routes.terms}>Terms</Link></li>
            <li><Link href={routes.accessibility}>Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
