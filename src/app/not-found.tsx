import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-teal">404</p>
      <h1 className="mt-3 font-serif text-4xl">This page is not in the studio</h1>
      <p className="mt-3 text-sm leading-6 text-ink-soft">The address does not match a Larkwell screen. Try the catalog, or return home.</p>
      <div className="mt-6 flex justify-center gap-3 text-sm">
        <Link href="/" className="rounded-full bg-teal px-4 py-2 text-paper">Home</Link>
        <Link href="/explore" className="rounded-full border border-line px-4 py-2">Courses</Link>
        <Link href="/search" className="rounded-full border border-line px-4 py-2">Search</Link>
      </div>
    </div>
  );
}
