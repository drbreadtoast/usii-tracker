// Shared constants + send helper for the inline vote on the welcome
// banner. Each click sends a Web3Forms submission to the same inbox
// the contact form uses; visitors never see aggregate counts.

export const VOTE_CHOICES = ["keep", "revert", "hybrid"] as const;
export type VoteChoice = (typeof VOTE_CHOICES)[number];

export const VOTE_LABELS: Record<VoteChoice, string> = {
  keep: "Keep this version",
  revert: "Bring back the old one",
  hybrid: "Hybrid (mix of both)",
};

export const VOTED_KEY = "survey-v1-voted";

const WEB3FORMS_KEY = "b6a6218f-b812-4dd9-a358-26536d4bb141";

export function readStoredVote(): VoteChoice | null {
  try {
    const v = localStorage.getItem(VOTED_KEY);
    if (v === "keep" || v === "revert" || v === "hybrid") return v;
  } catch {
    /* localStorage unavailable */
  }
  return null;
}

export async function sendVote(choice: VoteChoice): Promise<boolean> {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `[TheOSSreport] Vote — ${VOTE_LABELS[choice]}`,
        from_name: "TheOSSreport Vote",
        email: "anonymous@visitor.com",
        message: `Vote: ${VOTE_LABELS[choice]} (${choice})`,
        botcheck: "",
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
