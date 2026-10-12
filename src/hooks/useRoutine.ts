"use client";

import { sortTasksByStartTime } from "@/lib/routine";
import type { Routine, Task } from "@/lib/schemas";
import { readStore, removeStore, writeStore } from "@/lib/storage";
import { useStoredValue } from "./useStoredValue";

const EMPTY_ROUTINES: Record<string, Routine> = {};

/** Tasks are stored in day order; days can end after midnight, so sort from the profile's dayStart. */
const sortForProfile = (tasks: readonly Task[]) => sortTasksByStartTime(tasks, readStore("profile")?.dayStart);

/* ---------- Confirmed routines (`ro:v1:routines`) ---------- */

/** Confirmed routines keyed by date; `undefined` while hydrating. */
export function useRoutines(): Record<string, Routine> | undefined {
  const routines = useStoredValue("routines");
  return routines === undefined ? undefined : (routines ?? EMPTY_ROUTINES);
}

export function saveRoutine(routine: Routine): void {
  const routines = readStore("routines") ?? {};
  writeStore("routines", {
    ...routines,
    [routine.date]: { ...routine, tasks: sortForProfile(routine.tasks) },
  });
}

/** Persists a task change immediately (used by the checklist). */
export function updateRoutineTask(date: string, taskId: string, changes: Partial<Task>): void {
  const routine = readStore("routines")?.[date];
  if (!routine) return;
  saveRoutine({
    ...routine,
    tasks: routine.tasks.map((task) => (task.id === taskId ? { ...task, ...changes } : task)),
  });
}

/* ---------- Draft routine (`ro:v1:draftRoutine`) ---------- */

/** The AI proposal awaiting confirmation; `undefined` while hydrating, `null` if none. */
export function useDraftRoutine(): Routine | null | undefined {
  return useStoredValue("draftRoutine");
}

export function saveDraftRoutine(draft: Routine): void {
  writeStore("draftRoutine", { ...draft, status: "draft", tasks: sortForProfile(draft.tasks) });
}

export function discardDraftRoutine(): void {
  removeStore("draftRoutine");
}

/**
 * Moves the draft into the confirmed routines (replacing any routine for the
 * same day) and clears it. Returns the confirmed routine's date.
 */
export function confirmDraftRoutine(): string | null {
  const draft = readStore("draftRoutine");
  if (!draft) return null;
  saveRoutine({ ...draft, status: "confirmed" });
  removeStore("draftRoutine");
  return draft.date;
}
