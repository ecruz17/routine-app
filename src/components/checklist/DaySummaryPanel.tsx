import { CircleCheckBig, Clock, ListTodo } from "lucide-react";
import { getNextPendingTask, sumDurations } from "@/lib/routine";
import type { Task } from "@/lib/schemas";
import { formatDuration, to12h } from "@/lib/time-format";
import { Card } from "@/components/ui/Card";
import { checklistCopy } from "./copy";

type DaySummaryPanelProps = {
  tasks: readonly Task[];
  /** Profile day start, so after-midnight tasks count as the end of the day. */
  dayStart: string;
};

export function DaySummaryPanel({ tasks, dayStart }: DaySummaryPanelProps) {
  const copy = checklistCopy.summary;
  const nextTask = getNextPendingTask(tasks, dayStart);
  const plannedMinutes = sumDurations(tasks);
  const completedMinutes = sumDurations(tasks.filter((task) => task.completed));

  return (
    <Card as="aside" aria-labelledby="day-summary-title" className="flex flex-col gap-space-md">
      <h2 id="day-summary-title" className="font-display text-title-sm text-on-surface">
        {copy.title}
      </h2>

      <div className="flex flex-col gap-1 rounded-lg bg-primary-fixed/40 p-3">
        <span className="flex items-center gap-space-sm text-label-md text-primary">
          <ListTodo aria-hidden className="size-4" />
          {copy.next}
        </span>
        {nextTask ? (
          <p className="text-body-md text-on-surface">
            <span className="font-semibold">{nextTask.title}</span> · {to12h(nextTask.startTime)}
          </p>
        ) : (
          <p className="text-body-md text-on-surface-variant">{copy.allDone}</p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-space-sm">
        <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3">
          <dt className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <Clock aria-hidden className="size-4 text-primary" />
            {copy.planned}
          </dt>
          <dd className="font-display text-title-sm text-on-surface">{formatDuration(plannedMinutes)}</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3">
          <dt className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <CircleCheckBig aria-hidden className="size-4 text-secondary" />
            {copy.completedTime}
          </dt>
          <dd className="font-display text-title-sm text-on-surface">{formatDuration(completedMinutes)}</dd>
        </div>
      </dl>
    </Card>
  );
}
