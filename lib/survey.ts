// Event bus for opening the FeedbackSurveyModal from anywhere
// (mirrors lib/contact.ts).
//
// Usage:
//   import { openSurvey } from "@/lib/survey";
//   <button onClick={() => openSurvey()}>Rate the new site</button>

export const SURVEY_OPEN_EVENT = "survey:open";

export function openSurvey(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SURVEY_OPEN_EVENT));
}
