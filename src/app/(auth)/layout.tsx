export const instant = false;

import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="px-6 py-5">
        <Link href="/" aria-label="Larkwell home"><Logo /></Link>
      </div>
      <main id="main">{children}</main>
    </div>
  );
}
