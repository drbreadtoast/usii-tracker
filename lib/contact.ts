// Tiny event bus so any client component (e.g. the welcome banner)
// can pop open the global ContactModal without prop drilling.
//
// Usage from a client component:
//   import { openContact } from "@/lib/contact";
//   <button onClick={() => openContact("bug")}>Report a bug</button>

export const CONTACT_OPEN_EVENT = "contact:open";

export type ContactCategory = "bug" | "question" | "suggestion";

export function openContact(category: ContactCategory = "suggestion"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ category: ContactCategory }>(CONTACT_OPEN_EVENT, {
      detail: { category },
    }),
  );
}
