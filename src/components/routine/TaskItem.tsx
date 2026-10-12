import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import type { TaskIssue } from "@/lib/routine";
import type { Task } from "@/lib/schemas";
import { formatDuration, formatTimeRange } from "@/lib/time-format";
import { Chip } from "@/components/ui/Chip";
import { routineCopy } from "./copy";

type TaskItemProps = {
  task: Task;
  issues?: readonly TaskIssue[];
  /** Leading control, e.g. the checklist checkbox. */
  leading?: ReactNode;
  /** Trailing content: edit button in the suggestion, status chip in the checklist. */
  action?: ReactNode;
};

export function TaskItem({ task, issues = [], leading, action }: TaskItemProps) {
  return (
    <article className="flex items-center justify-between gap-space-sm rounded-xl border border-border-subtle bg-surface-container-lowest p-space-md shadow-level-1 transition-shadow hover:shadow-level-2">
      <div className="flex min-w-0 items-start gap-space-md">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span
              className={cn(
                "text-label-md font-bold transition-colors",
                task.completed ? "text-on-surface-variant" : "text-primary",
              )}
            >
              {formatTimeRange(task.startTime, task.durationMinutes)}
            </span>
            <Chip size="sm">{formatDuration(task.durationMinutes)}</Chip>
          </div>
          <h3
            className={cn(
              "font-display text-title-sm break-words transition-colors md:text-headline-md",
              task.completed ? "text-on-surface-variant line-through decoration-outline/70" : "text-on-surface",
            )}
          >
            {task.title}
          </h3>
          {issues.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-space-xs">
              {issues.map((issue) => (
                <li key={issue}>
                  <Chip size="sm" tone="warning">
                    <TriangleAlert aria-hidden className="size-3.5" />
                    {routineCopy.issues[issue]}
                  </Chip>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </article>
  );
}
