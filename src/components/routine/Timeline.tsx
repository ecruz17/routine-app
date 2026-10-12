import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TimelineDotTone = "primary" | "muted" | "success";

const dotClasses: Record<TimelineDotTone, string> = {
  primary: "bg-primary",
  muted: "bg-outline",
  success: "bg-success",
};

/** Vertical timeline rail; children should be <TimelineItem>s. */
export function Timeline({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ol
      aria-label={label}
      className="relative flex flex-col gap-space-sm pl-6 before:absolute before:top-4 before:bottom-4 before:left-2 before:w-0.5 before:bg-surface-variant"
    >
      {children}
    </ol>
  );
}

type TimelineItemProps = {
  tone?: TimelineDotTone;
  children: ReactNode;
};

export function TimelineItem({ tone = "primary", children }: TimelineItemProps) {
  return (
    <li className="relative">
      <span
        aria-hidden
        className={cn("absolute top-6 -left-5.25 size-3 rounded-full ring-4 ring-surface", dotClasses[tone])}
      />
      {children}
    </li>
  );
}
