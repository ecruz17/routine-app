import { Fragment, type ReactNode } from "react";
import type { Task, WorkSchedule } from "@/lib/schemas";
import { minutesIntoDay } from "@/lib/routine";
import { Timeline, TimelineItem } from "./Timeline";
import { WorkBlockItem } from "./WorkBlockItem";

type RoutineTimelineProps = {
  label: string;
  /** Tasks already sorted in day order. */
  tasks: readonly Task[];
  /** Profile day start; positions are measured from it (days can end after midnight). */
  dayStart: string;
  /** Work block to place in time order; null to hide it. */
  workSchedule: WorkSchedule | null;
  renderTask: (task: Task) => ReactNode;
};

/** Timeline of tasks with the reserved work block placed in time order. */
export function RoutineTimeline({ label, tasks, dayStart, workSchedule, renderTask }: RoutineTimelineProps) {
  const workBlockIndex = workSchedule
    ? tasks.filter(
        (task) => minutesIntoDay(task.startTime, dayStart) < minutesIntoDay(workSchedule.start, dayStart),
      ).length
    : -1;

  const workBlock = workSchedule && (
    <TimelineItem tone="muted">
      <WorkBlockItem workSchedule={workSchedule} />
    </TimelineItem>
  );

  return (
    <Timeline label={label}>
      {tasks.map((task, index) => (
        <Fragment key={task.id}>
          {index === workBlockIndex && workBlock}
          <TimelineItem tone={task.completed ? "success" : "primary"}>{renderTask(task)}</TimelineItem>
        </Fragment>
      ))}
      {workBlockIndex === tasks.length && workBlock}
    </Timeline>
  );
}
