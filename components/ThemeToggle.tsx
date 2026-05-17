"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore (private browsing, etc.)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-sm transition hover:bg-surface-muted"
      suppressHydrationWarning
    >
      <span aria-hidden className="text-base leading-none">
        {theme === "dark" ? "☀" : theme === "light" ? "☾" : "◐"}
      </span>
    </button>
  );
}
