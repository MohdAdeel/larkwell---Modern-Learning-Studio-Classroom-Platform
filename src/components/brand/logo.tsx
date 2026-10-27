import { cn } from "@/lib/cn";

export function Mark({ className, tone = "default" }: { className?: string; tone?: "default" | "inverse" }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-teal", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={tone === "inverse" ? "#F4F1EB" : "currentColor"} />
      <path
        d="M7.5 21.5c4.2-.6 6.4-3.6 8-8.2"
        stroke={tone === "inverse" ? "#1D433E" : "#F7F3EC"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13.2 19.2c3.6-2.3 7.2-2.6 11.2-1.2"
        stroke={tone === "inverse" ? "#A56A4E" : "#E4C2AE"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 24.2h9.5"
        stroke={tone === "inverse" ? "#1D433E" : "#F7F3EC"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  wordmark = true,
  tone = "default",
}: {
  className?: string;
  wordmark?: boolean;
  tone?: "default" | "inverse";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className="size-8 shrink-0" tone={tone} />
      {wordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif text-[1.35rem] tracking-[-0.03em]",
              tone === "inverse" ? "text-paper" : "text-ink",
            )}
          >
            Larkwell
          </span>
        </span>
      ) : null}
    </span>
  );
}
