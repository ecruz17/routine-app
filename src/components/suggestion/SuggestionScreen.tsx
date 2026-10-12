"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListOrdered } from "lucide-react";
import { setHomeInput } from "@/lib/home-input-store";
import { countIssues, getTaskIssues, getWorkScheduleForDate } from "@/lib/routine";
import type { Routine, Task, TaskEdit, UserProfile } from "@/lib/schemas";
import { useRequiredProfile } from "@/hooks/useProfile";
import { confirmDraftRoutine, discardDraftRoutine, saveDraftRoutine, useDraftRoutine } from "@/hooks/useRoutine";
import { ScreenSkeleton } from "@/components/ui/ScreenSkeleton";
import { EmptyRoutineState } from "@/components/routine/EmptyRoutineState";
import { RoutineTimeline } from "@/components/routine/RoutineTimeline";
import { TaskEditButton } from "@/components/routine/TaskEditButton";
import { TaskEditor } from "@/components/routine/TaskEditor";
import { TaskItem } from "@/components/routine/TaskItem";
import { suggestionCopy } from "./copy";
import { PlanReviewPanel } from "./PlanReviewPanel";
import { SuggestionActions } from "./SuggestionActions";
import { SuggestionHeader } from "./SuggestionHeader";

export function SuggestionScreen() {
  const profile = useRequiredProfile();
  const draft = useDraftRoutine();
  // Confirming/cancelling clears the draft; keep the skeleton up until navigation finishes.
  const [isLeaving, setIsLeaving] = useState(false);

  if (draft === undefined || isLeaving) return <ScreenSkeleton />;

  if (!draft) {
    const copy = suggestionCopy.empty;
    return (
      <EmptyRoutineState title={copy.title} description={copy.description} actionLabel={copy.action} actionHref="/home" />
    );
  }

  return <SuggestionContent profile={profile} draft={draft} onLeave={() => setIsLeaving(true)} />;
}

type SuggestionContentProps = {
  profile: UserProfile;
  draft: Routine;
  onLeave: () => void;
};

function SuggestionContent({ profile, draft, onLeave }: SuggestionContentProps) {
  const router = useRouter();
  const { tasks } = draft; // Kept sorted by saveDraftRoutine.
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const workSchedule = getWorkScheduleForDate(profile, draft.date);
  const issues = useMemo(() => getTaskIssues(tasks, profile, draft.date), [tasks, profile, draft.date]);

  const handleSave = (taskId: string, changes: TaskEdit) => {
    saveDraftRoutine({
      ...draft,
      tasks: tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task)),
    });
    setEditingTask(null);
  };

  const handleConfirm = () => {
    onLeave();
    const date = confirmDraftRoutine();
    router.push(date ? `/checklist?date=${date}` : "/checklist");
  };

  const handleCancel = () => {
    // Home restores the typed text and day.
    setHomeInput({ date: draft.date, ...draft.rawInput });
    onLeave();
    discardDraftRoutine();
    router.push("/home");
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <SuggestionHeader date={draft.date} />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <section aria-labelledby="timeline-title" className="flex flex-col gap-space-md lg:col-span-8">
          <div className="flex items-center justify-between gap-space-sm">
            <h2 id="timeline-title" className="flex items-center gap-space-sm font-display text-title-sm text-on-surface">
              <ListOrdered aria-hidden className="size-5.5 text-primary" />
              {suggestionCopy.timeline.title}
            </h2>
            <span className="hidden text-label-sm text-on-surface-variant sm:inline">
              {suggestionCopy.timeline.hint}
            </span>
          </div>

          <RoutineTimeline
            label={suggestionCopy.timeline.label}
            tasks={tasks}
            dayStart={profile.dayStart}
            workSchedule={workSchedule}
            renderTask={(task) => (
              <TaskItem
                task={task}
                issues={issues.get(task.id)}
                action={<TaskEditButton taskTitle={task.title} onClick={() => setEditingTask(task)} />}
              />
            )}
          />
        </section>

        <div className="lg:col-span-4">
          <PlanReviewPanel issueCounts={countIssues(issues)} profile={profile} hasWorkSchedule={workSchedule !== null} />
        </div>
      </div>

      <SuggestionActions onCancel={handleCancel} onConfirm={handleConfirm} />

      <TaskEditor key={editingTask?.id} task={editingTask} onSave={handleSave} onClose={() => setEditingTask(null)} />
    </div>
  );
}
