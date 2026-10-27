"use client";

import { createContext, useContext, useState } from "react";
import { createId } from "@/lib/ids";
import { cn } from "@/lib/cn";

type ToastItem = { id: string; title: string; description?: string; tone?: "default" | "success" | "warning" };

const ToastContext = createContext<(toast: Omit<ToastItem, "id">) => void>(() => undefined);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = (toast: Omit<ToastItem, "id">) => {
    const id = createId("toast");
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3800);
  };

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto animate-pop rounded-2xl border border-line bg-surface px-4 py-3 shadow-lift",
              toast.tone === "success" && "border-success/30",
              toast.tone === "warning" && "border-warning/40",
            )}
          >
            <p className="text-sm font-medium text-ink">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm leading-5 text-ink-soft">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
