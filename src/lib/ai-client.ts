/**
 * Client for the routine organizer. Builds the backend request from the Home
 * input + profile, calls the same-origin proxy (which adds the API key), and
 * maps the untrusted AI response to internal Tasks. Human-readable formats
 * ("8 a.m.", "1 hora 30 minutos") are converted only here.
 */
import {
  ORGANIZE_ENDPOINT,
  organizeResponseSchema,
  type OrganizeRequest,
  type OrganizeResponse,
} from "@/lib/ai-contract";
import { getWorkScheduleForDate, sortTasksByStartTime } from "@/lib/routine";
import type { Task, UserProfile } from "@/lib/schemas";
import { parseDuration, parseTime, to12h } from "@/lib/time-format";

const REQUEST_TIMEOUT_MS = 20_000;

export type OrganizeErrorKind = "timeout" | "network" | "rateLimited" | "server" | "invalidResponse" | "noTasks";

export class OrganizeError extends Error {
  constructor(readonly kind: OrganizeErrorKind) {
    super(`Could not organize the routine (${kind}).`);
    this.name = "OrganizeError";
  }
}

type OrganizeInput = {
  /** Selected day ("YYYY-MM-DD"); decides whether the work block applies. */
  date: string;
  userTasks: string;
  events: string;
  profile: UserProfile;
};

export function buildOrganizeRequest({ date, userTasks, events, profile }: OrganizeInput): OrganizeRequest {
  // Work hours only apply Mon–Fri; "" on weekends or without a schedule.
  const workSchedule = getWorkScheduleForDate(profile, date);
  return {
    userTasks: userTasks.trim(),
    startDayTime: to12h(profile.dayStart),
    endDayTime: to12h(profile.dayEnd),
    workingHours: workSchedule ? `${to12h(workSchedule.start)} to ${to12h(workSchedule.end)}` : "",
    events: events.trim(),
  };
}

/**
 * Maps the raw response to Tasks, dropping entries whose name, time or
 * duration can't be understood instead of failing the whole response. Tasks
 * may not match the input one-to-one (the model can rename, split or merge).
 */
export function mapOrganizedTasks(response: OrganizeResponse, dayStart: string): Task[] {
  const tasks: Task[] = [];
  for (const item of response.organizedTasks) {
    const title = item.taskName.trim();
    const startTime = parseTime(item.suggestedStartTime);
    const durationMinutes = parseDuration(item.estimatedDuration);
    if (!title || !startTime || !durationMinutes) {
      console.warn("Dropping an AI task that couldn't be parsed.", item);
      continue;
    }
    tasks.push({ id: crypto.randomUUID(), title, startTime, durationMinutes, completed: false });
  }
  // Overlaps and tasks outside the day are allowed through; the user fixes them in the editor.
  return sortTasksByStartTime(tasks, dayStart);
}

/** Calls the organizer and returns the proposed tasks. Throws `OrganizeError`. */
export async function organizeRoutine(input: OrganizeInput): Promise<Task[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(ORGANIZE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrganizeRequest(input)),
      signal: controller.signal,
    });
  } catch {
    throw new OrganizeError(controller.signal.aborted ? "timeout" : "network");
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) throw new OrganizeError("rateLimited");
  if (response.status === 504) throw new OrganizeError("timeout");
  if (!response.ok) throw new OrganizeError("server");

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new OrganizeError("invalidResponse");
  }
  const parsed = organizeResponseSchema.safeParse(body);
  if (!parsed.success) throw new OrganizeError("invalidResponse");

  const tasks = mapOrganizedTasks(parsed.data, input.profile.dayStart);
  if (tasks.length === 0) throw new OrganizeError("noTasks");
  return tasks;
}
