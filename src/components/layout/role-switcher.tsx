"use client";

import { useRouter } from "next/navigation";
import { demoProfiles } from "@/components/layout/navigation";
import { homeForRole } from "@/lib/routes";
import { useStore } from "@/lib/mock-store";

export function RoleSwitcher({ id = "role-switcher" }: { id?: string }) {
  const router = useRouter();
  const { state, actions } = useStore();
  const value = `${state.session.role}:${state.session.userId ?? ""}`;

  return (
    <label className="grid gap-1 text-xs text-muted">
      <span className="font-medium tracking-wide uppercase">Preview the studio</span>
      <select
        id={id}
        value={demoProfiles.some((profile) => `${profile.role}:${profile.userId ?? ""}` === value) ? value : "guest:"}
        onChange={(event) => {
          const profile = demoProfiles.find((item) => `${item.role}:${item.userId ?? ""}` === event.target.value);
          if (!profile) return;
          actions.signIn(profile.role, profile.userId);
          router.push(homeForRole(profile.role));
        }}
        className="h-10 rounded-full border border-line bg-surface px-3 text-sm text-ink"
      >
        {demoProfiles.map((profile) => (
          <option key={`${profile.role}-${profile.userId}`} value={`${profile.role}:${profile.userId ?? ""}`}>
            {profile.label} · {profile.detail}
          </option>
        ))}
      </select>
    </label>
  );
}
