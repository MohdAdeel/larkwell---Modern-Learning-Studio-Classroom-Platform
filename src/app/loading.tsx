export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-full bg-paper-deep" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-paper-deep" />
    </div>
  );
}
