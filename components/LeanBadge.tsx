import type { Lean } from "@/lib/types";
import { LEAN_LABELS } from "@/lib/types";

const LEAN_CLASSES: Record<Lean, string> = {
  left: "bg-lean-left-bg text-lean-left",
  center: "bg-lean-center-bg text-lean-center",
  right: "bg-lean-right-bg text-lean-right",
  "foreign-western": "bg-lean-foreign-western-bg text-lean-foreign-western",
  "foreign-eastern": "bg-lean-foreign-eastern-bg text-lean-foreign-eastern",
  "foreign-global-south":
    "bg-lean-foreign-global-south-bg text-lean-foreign-global-south",
  government: "bg-lean-government-bg text-lean-government",
  social: "bg-lean-social-bg text-lean-social",
};

interface Props {
  lean: Lean;
  size?: "sm" | "md";
}

export default function LeanBadge({ lean, size = "sm" }: Props) {
  const sizeClasses =
    size === "md" ? "text-sm px-2.5 py-1" : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wide ${sizeClasses} ${LEAN_CLASSES[lean]}`}
      role="status"
      aria-label={`Perspective: ${LEAN_LABELS[lean]}`}
    >
      {LEAN_LABELS[lean]}
    </span>
  );
}
