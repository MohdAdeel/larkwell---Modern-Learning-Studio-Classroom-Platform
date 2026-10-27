"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-4xl">Something slipped</h1>
      <p className="mt-3 text-sm leading-6 text-ink-soft">The studio hit an unexpected error in this demo. You can try the view again.</p>
      <button type="button" className="mt-6 rounded-full bg-teal px-4 py-2 text-sm text-paper" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
