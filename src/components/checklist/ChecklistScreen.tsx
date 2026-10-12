"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListChecks } from "lucide-react";
import { addDays, startOfWeek } from "@/lib/dates";
import {
  getRoutineProgress,
  getWorkScheduleForDate,
  isRoutineComplete,
  pickDefaultRoutineDate,
  sortTasksByStartTime,
} from "@/lib/routine";
import type { Routine, UserProfile } from "@/lib/schemas";
import { useRequiredProfile } from "@/hooks/useProfile";
import { updateRoutineTask, useRoutines } from "@/hooks/useRoutine";
import { useToday } from "@/hooks/useToday";
import { DaySelector } from "@/components/calendar/DaySelector";
import type { DayCaption } from "@/components/calendar/DayCard";
import { CompletedAnimation } from "@/components/routine/CompletedAnimation";
import { EmptyRoutineState } from "@/components/routine/EmptyRoutineState";
import { RoutineTimeline } from "@/components/routine/RoutineTimeline";
import { TaskCheckbox } from "@/components/routine/TaskCheckbox";
import { TaskItem } from "@/components/routine/TaskItem";
import { routineCopy } from "@/components/routine/copy";
import { Chip } from "@/components/ui/Chip";
import { ScreenSkeleton } from "@/components/ui/ScreenSkeleton";
import { ChecklistHeader } from "./ChecklistHeader";
import { checklistCopy } from "./copy";
import { DaySummaryPanel } from "./DaySummaryPanel";

/** Must be rendered inside <Suspense> (reads `?date=` with useSearchParams). */
export function ChecklistScreen() {
  const profile = useRequiredProfile();
  const routines = useRoutines();
  const today = useToday();
  const requestedDate = useSearchParams().get("date");

  if (!today || !routines) return <ScreenSkeleton />;

  return <ChecklistContent profile={profile} routines={routines} today={today} requestedDate={requestedDate} />;
}

type ChecklistContentProps = {
  profile: UserProfile;
  /** Confirmed routines keyed by date ("YYYY-MM-DD"). */
  routines: Record<string, Routine>;
  today: string;
  /** Day to open first, e.g. right after confirming a proposal. */
  requestedDate: string | null;
};

function ChecklistContent({ profile, routines, today, requestedDate }: ChecklistContentProps) {
  const [selectedDate, setSelectedDate] = useState(() =>
    requestedDate && routines[requestedDate] ? requestedDate : pickDefaultRoutineDate(Object.keys(routines), today),
  );
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selectedDate));
  const [isCelebrating, setIsCelebrating] = useState(false);

  const routine = routines[selectedDate];

  const getCaption = (date: string): DayCaption | null => {
    const dayRoutine = routines[date];
    if (!dayRoutine) return null;
    return isRoutineComplete(dayRoutine.tasks)
      ? { text: checklistCopy.dayCaption.done, tone: "accent" }
      : { text: checklistCopy.dayCaption.withRoutine };
  };

  const handleToggle = (taskId: string, completed: boolean) => {
    if (!routine) return;
    const changes = { completed, completedAt: completed ? new Date().toISOString() : undefined };
    const tasks = routine.tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task));
    updateRoutineTask(routine.date, taskId, changes);
    if (!isRoutineComplete(routine.tasks) && isRoutineComplete(tasks)) setIsCelebrating(true);
  };

  const daySelector = (
    <DaySelector
      title={checklistCopy.daySelectorTitle}
      weekStart={weekStart}
      selectedDate={selectedDate}
      today={today}
      onSelect={setSelectedDate}
      onPreviousWeek={() => setWeekStart((current) => addDays(current, -7))}
      onNextWeek={() => setWeekStart((current) => addDays(current, 7))}
      getCaption={getCaption}
    />
  );

  if (!routine) {
    const copy = checklistCopy.empty;
    return (
      <div className="flex flex-col gap-space-lg">
        {daySelector}
        <EmptyRoutineState title={copy.title} description={copy.description} actionLabel={copy.action} actionHref="/home" />
      </div>
    );
  }

  const tasks = sortTasksByStartTime(routine.tasks, profile.dayStart);
  const progress = getRoutineProgress(tasks);
  const celebrationCopy = checklistCopy.celebration;

  return (
    <div className="flex flex-col gap-space-lg">
      {daySelector}

      <ChecklistHeader date={routine.date} today={today} progress={progress} />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <section aria-labelledby="checklist-title" className="flex flex-col gap-space-md lg:col-span-8">
          <h2 id="checklist-title" className="flex items-center gap-space-sm font-display text-title-sm text-on-surface">
            <ListChecks aria-hidden className="size-5.5 text-primary" />
            {checklistCopy.list.title}
          </h2>
          <RoutineTimeline
            label={checklistCopy.list.label}
            tasks={tasks}
            dayStart={profile.dayStart}
            workSchedule={getWorkScheduleForDate(profile, routine.date)}
            renderTask={(task) => (
              <TaskItem
                task={task}
                leading={
                  <TaskCheckbox
                    taskTitle={task.title}
                    checked={task.completed}
                    onChange={(checked) => handleToggle(task.id, checked)}
                  />
                }
                action={
                  <span aria-hidden className="hidden sm:block">
                    <Chip size="sm" tone={task.completed ? "secondary" : "primary"}>
                      {task.completed ? routineCopy.status.done : routineCopy.status.pending}
                    </Chip>
                  </span>
                }
              />
            )}
          />
        </section>

        <div className="lg:col-span-4">
          <DaySummaryPanel tasks={tasks} dayStart={profile.dayStart} />
        </div>
      </div>

      <CompletedAnimation
        open={isCelebrating}
        onClose={() => setIsCelebrating(false)}
        copy={{
          title: celebrationCopy.title,
          message: celebrationCopy.message(profile.name),
          stats: [
            { label: celebrationCopy.completion, value: `${progress.percent}%` },
            { label: celebrationCopy.tasks, value: celebrationCopy.tasksValue(progress.total) },
          ],
          close: celebrationCopy.close,
          action: celebrationCopy.action,
        }}
      />
    </div>
  );
}
