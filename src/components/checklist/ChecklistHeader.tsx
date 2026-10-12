import { PartyPopper } from "lucide-react";
import type { RoutineProgress } from "@/lib/routine";
import { formatLongDayLabel } from "@/lib/dates";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { checklistCopy } from "./copy";

type ChecklistHeaderProps = {
  date: string;
  today: string;
  progress: RoutineProgress;
};

export function ChecklistHeader({ date, today, progress }: ChecklistHeaderProps) {
  const copy = checklistCopy;
  const isComplete = progress.total > 0 && progress.completed === progress.total;
  const dayStatus = date === today ? copy.status.today : date > today ? copy.status.upcoming : copy.status.past;

  return (
    <Card as="section" className="flex flex-col items-start justify-between gap-space-md lg:flex-row lg:items-center">
      <div className="flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-sm">
          <Chip tone={date === today ? "secondary" : "neutral"}>
            {date === today && <span aria-hidden className="size-2 animate-pulse rounded-full bg-secondary" />}
            {dayStatus}
          </Chip>
          {isComplete && (
            <Chip tone="secondary">
              <PartyPopper aria-hidden className="size-4" />
              {copy.status.completed}
            </Chip>
          )}
        </div>
        <h1 className="mt-1 font-display text-headline-lg-mobile tracking-tight text-on-surface md:text-headline-lg">
          {formatLongDayLabel(date)}
        </h1>
        <p className="text-body-md text-on-surface-variant">{copy.subtitle}</p>
      </div>

      <div className="flex w-full items-center gap-space-lg rounded-xl bg-surface-container-low px-space-md py-space-sm lg:w-auto lg:min-w-80">
        <ProgressRing value={progress.percent} />
        <div className="flex grow flex-col gap-1.5">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="text-label-md text-on-surface" aria-live="polite">
              {copy.progressSummary(progress.completed, progress.total)}
            </span>
            <span className="text-label-sm font-bold text-secondary">{progress.percent}%</span>
          </div>
          <ProgressBar value={progress.percent} label={copy.progressLabel} />
        </div>
      </div>
    </Card>
  );
}
