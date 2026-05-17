"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-stale-error">
        Error
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 text-base text-muted">
        An unexpected error occurred while rendering this page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-muted"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-muted"
        >
          ← Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-xs text-muted">
          digest: {error.digest}
        </p>
      )}
    </div>
  );
}
