import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/formatters";

const tones = [
  "bg-teal-soft text-teal-deep",
  "bg-clay-soft text-clay-deep",
  "bg-blue-soft text-blue",
  "bg-sage-soft text-teal-deep",
  "bg-gold-soft text-warning",
  "bg-paper-deep text-ink",
];

export function Avatar({ name, tone = 0, size = "md" }: { name: string; tone?: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        tones[tone % tones.length],
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-14 text-lg",
      )}
    >
      {initials(name)}
    </span>
  );
}

const badgeTones = {
  neutral: "bg-paper-deep text-ink-soft",
  teal: "bg-teal-soft text-teal-deep",
  sage: "bg-sage-soft text-teal-deep",
  blue: "bg-blue-soft text-blue",
  clay: "bg-clay-soft text-clay-deep",
  gold: "bg-gold-soft text-warning",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function statusTone(status: string): keyof typeof badgeTones {
  if (["published", "active", "verified", "paid", "completed", "present", "resolved", "returned"].includes(status)) return "success";
  if (["live", "recommended", "trialing"].includes(status)) return "teal";
  if (["scheduled", "open", "in-review", "pending", "waiting", "in-progress"].includes(status)) return "blue";
  if (["draft", "invited", "private", "not-started"].includes(status)) return "neutral";
  if (["past-due", "late", "needs-info", "high"].includes(status)) return "gold";
  if (["cancelled", "suspended", "archived", "refunded", "absent", "hidden"].includes(status)) return "danger";
  return "neutral";
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{status.replace("-", " ")}</Badge>;
}

export function Rating({ value, count }: { value: number; count?: number }) {
  if (!count) return <span className="text-sm text-muted">New</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <Star className="size-3.5 fill-gold text-gold" aria-hidden />
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      <span className="text-muted">({count})</span>
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <h3 className="font-serif text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-paper-deep", className)} />;
}

export function PageFallback({ label = "Opening the studio" }: { label?: string }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-gold/30 bg-gold-soft px-3.5 py-2.5 text-sm leading-6 text-ink-soft">{children}</p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal">{eyebrow}</p> : null}
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Sections" className="flex gap-1 overflow-auto rounded-full bg-paper-deep p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition",
            value === tab.id ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-teal" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-3xl border border-line bg-surface p-5 shadow-soft", className)}>{children}</section>;
}
