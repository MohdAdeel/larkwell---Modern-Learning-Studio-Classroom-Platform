"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createContext, useContext } from "react";
import { STORAGE_KEY, STORAGE_VERSION, createSeed } from "@/data/dummy/seed";
import { createActions } from "@/lib/mock-actions";
import type { AppState } from "@/types";

const serverState = createSeed();
let clientState: AppState | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: number; state?: AppState };
    if (parsed.version !== STORAGE_VERSION || !parsed.state?.courses || !parsed.state.session) return null;
    return parsed.state;
  } catch {
    return null;
  }
}

export function getServerSnapshot() {
  return serverState;
}

export function getSnapshot() {
  if (!clientState) {
    clientState = readStorage() ?? structuredClone(serverState);
  }
  return clientState;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function commit(recipe: (draft: AppState) => void) {
  const next = structuredClone(getSnapshot());
  recipe(next);
  clientState = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: next }));
  } catch {
    // The demo keeps working in memory if the browser refuses storage.
  }
  emit();
}

export function resetDemo() {
  clientState = createSeed();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
  emit();
}

export function createStoreActions() {
  return { ...createActions(commit), resetDemo };
}

export type StoreActions = ReturnType<typeof createStoreActions>;

const StoreContext = createContext<{ state: AppState; actions: StoreActions } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const actions = useMemo(() => createStoreActions(), []);
  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
