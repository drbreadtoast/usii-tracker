import type { Perspective } from "@/lib/types";
import LeanBadge from "./LeanBadge";
import SourceLink from "./SourceLink";

interface Props {
  perspective: Perspective;
}

export default function PerspectiveBlock({ perspective }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <LeanBadge lean={perspective.lean} size="md" />
        <span className="text-xs text-muted">
          {perspective.sources.length} source
          {perspective.sources.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground/90 leading-relaxed">
        {perspective.keyFraming}
      </p>
      <p className="text-sm leading-relaxed text-foreground/80">
        {perspective.summary}
      </p>
      <div className="mt-1 flex flex-col gap-1.5">
        {perspective.sources.map((s) => (
          <SourceLink key={s.url} source={s} />
        ))}
      </div>
    </div>
  );
}
