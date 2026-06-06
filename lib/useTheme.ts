"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

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

// The site bootstraps to dark (see app/layout.tsx theme bootstrap), so dark
// is the correct server/first-paint default.
function getServerSnapshot(): Theme {
  return "dark";
}

/**
 * Subscribes to the active theme — the `dark` class on <html> that
 * ThemeToggle flips — and re-renders the caller when it changes.
 *
 * Embedded third-party widgets (TradingView) read their color theme once at
 * mount; without this they freeze at their initial theme and render a white
 * panel after the user toggles to dark. Components that call this and add the
 * returned value to their effect deps will tear down and re-inject the widget
 * on every toggle. Mirrors the observer pattern in components/ThemeToggle.tsx.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
