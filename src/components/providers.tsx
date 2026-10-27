"use client";

import { Suspense } from "react";
import { ConfirmProvider } from "@/components/ui/dialog";
import { ToastProvider } from "@/components/ui/toast";
import { StoreProvider } from "@/lib/mock-store";
import { PageFallback } from "@/components/ui/feedback";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Suspense fallback={<PageFallback />}>{children}</Suspense>
        </ConfirmProvider>
      </ToastProvider>
    </StoreProvider>
  );
}
