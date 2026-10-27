"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previous.current = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const focusable = root?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "animate-pop relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl border border-line bg-surface p-6 shadow-lift",
          className,
        )}
      >
        <h2 id={titleId} className="font-serif text-2xl tracking-tight text-ink">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p> : null}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

type ConfirmOptions = {
  title: string;
  body: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
};

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>(() => undefined);

  const confirm = (next: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setOptions(next);
    });

  const close = (value: boolean) => {
    resolver.current(value);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={Boolean(options)} title={options?.title ?? ""} description={options?.body} onClose={() => close(false)}>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button variant={options?.tone === "danger" ? "danger" : "primary"} onClick={() => close(true)}>
            {options?.confirmLabel ?? "Confirm"}
          </Button>
        </div>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
