import Link from "next/link";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-muted"
      >
        ← Back to home
      </Link>
    </div>
  );
}
