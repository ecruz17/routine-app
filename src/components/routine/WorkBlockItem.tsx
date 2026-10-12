import { BriefcaseBusiness, Lock } from "lucide-react";
import type { WorkSchedule } from "@/lib/schemas";
import { formatDuration, minutesBetween, to12h } from "@/lib/time-format";
import { Chip } from "@/components/ui/Chip";
import { routineCopy } from "./copy";

type WorkBlockItemProps = {
  workSchedule: WorkSchedule;
};

/** Read-only work/school block shown between the tasks. */
export function WorkBlockItem({ workSchedule }: WorkBlockItemProps) {
  const copy = routineCopy.workBlock;
  const duration = minutesBetween(workSchedule.start, workSchedule.end);

  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container/70 p-space-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-space-sm">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant">
          <BriefcaseBusiness aria-hidden className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="text-label-md font-bold text-on-surface-variant">
              {to12h(workSchedule.start)} – {to12h(workSchedule.end)}
            </span>
            <Chip size="sm">{formatDuration(duration)}</Chip>
            <Chip size="sm" tone="muted">
              <Lock aria-hidden className="size-3" />
              {copy.badge}
            </Chip>
          </div>
          <h3 className="font-display text-title-sm text-on-surface-variant md:text-headline-md">{copy.title}</h3>
        </div>
      </div>
      <span className="self-start rounded-lg bg-surface-container-highest/60 px-2.5 py-1 text-label-sm text-on-surface-variant sm:self-center">
        {copy.note}
      </span>
    </div>
  );
}
