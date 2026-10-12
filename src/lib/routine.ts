import type { Task, UserProfile } from "@/lib/schemas";
import { isWeekend } from "@/lib/dates";
import { minutesBetween } from "@/lib/time-format";

export type TaskIssue = "overlap" | "workSchedule" | "outsideDay";

type Range = { start: number; end: number };

/**
 * Position of a time inside the user's day, in minutes since `dayStart`.
 * Handles days that end after midnight: with dayStart "08:00", "00:30" → 990
 * (after "23:00" → 900), so late-night tasks sort at the end of the day.
 */
export function minutesIntoDay(time: string, dayStart: string): number {
  return minutesBetween(dayStart, time);
}

/** Sorts in day order. Pass the profile's `dayStart` so after-midnight tasks go last. */
export function sortTasksByStartTime(tasks: readonly Task[], dayStart = "00:00"): Task[] {
  return [...tasks].sort(
    (a, b) => minutesIntoDay(a.startTime, dayStart) - minutesIntoDay(b.startTime, dayStart),
  );
}

function taskRange(task: Task, dayStart: string): Range {
  const start = minutesIntoDay(task.startTime, dayStart);
  return { start, end: start + task.durationMinutes };
}

const rangesOverlap = (a: Range, b: Range) => a.start < b.end && b.start < a.end;

/** The work block that applies to `date`, or null on weekends / without a schedule. */
export function getWorkScheduleForDate(profile: UserProfile, date: string) {
  return profile.workSchedule && !isWeekend(date) ? profile.workSchedule : null;
}

/**
 * Scheduling problems per task id. Problems are only highlighted, never
 * blocking: the user fixes them in the editor. All ranges are measured from
 * the start of the user's day, so days ending after midnight work.
 */
export function getTaskIssues(
  tasks: readonly Task[],
  profile: UserProfile,
  date: string,
): Map<string, TaskIssue[]> {
  const { dayStart, dayEnd } = profile;
  const workSchedule = getWorkScheduleForDate(profile, date);
  const workRange = workSchedule && {
    start: minutesIntoDay(workSchedule.start, dayStart),
    end: minutesIntoDay(workSchedule.end, dayStart),
  };
  const dayLength = minutesBetween(dayStart, dayEnd);
  const issues = new Map<string, TaskIssue[]>();

  for (const task of tasks) {
    const range = taskRange(task, dayStart);
    const taskIssues: TaskIssue[] = [];

    if (tasks.some((other) => other.id !== task.id && rangesOverlap(range, taskRange(other, dayStart)))) {
      taskIssues.push("overlap");
    }
    if (workRange && rangesOverlap(range, workRange)) {
      taskIssues.push("workSchedule");
    }
    // Tasks before dayStart wrap to the end (e.g. 07:00 → 1380), so they land here too.
    if (range.end > dayLength) {
      taskIssues.push("outsideDay");
    }
    if (taskIssues.length > 0) issues.set(task.id, taskIssues);
  }

  return issues;
}

/** Number of tasks affected by each kind of issue. */
export function countIssues(issues: Map<string, TaskIssue[]>): Record<TaskIssue, number> {
  const counts: Record<TaskIssue, number> = { overlap: 0, workSchedule: 0, outsideDay: 0 };
  for (const taskIssues of issues.values()) {
    for (const issue of taskIssues) counts[issue] += 1;
  }
  return counts;
}

export type RoutineProgress = { completed: number; total: number; percent: number };

export function getRoutineProgress(tasks: readonly Task[]): RoutineProgress {
  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function isRoutineComplete(tasks: readonly Task[]): boolean {
  return tasks.length > 0 && tasks.every((task) => task.completed);
}

/** First pending task in day order, if any. */
export function getNextPendingTask(tasks: readonly Task[], dayStart: string): Task | undefined {
  return sortTasksByStartTime(tasks, dayStart).find((task) => !task.completed);
}

/** Total minutes of the given tasks. */
export function sumDurations(tasks: readonly Task[]): number {
  return tasks.reduce((total, task) => total + task.durationMinutes, 0);
}

/** Today's routine if any, otherwise the closest upcoming one, otherwise the latest past one. */
export function pickDefaultRoutineDate(routineDates: readonly string[], today: string): string {
  const sorted = [...routineDates].sort();
  if (sorted.includes(today)) return today;
  return sorted.find((date) => date > today) ?? sorted.at(-1) ?? today;
}
