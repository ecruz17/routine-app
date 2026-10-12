import { scheduleSettingsSchema, type ScheduleSettings } from "@/lib/schemas";

export type ScheduleErrors = Partial<Record<"dayStart" | "dayEnd" | "workStart" | "workEnd", string>>;

const fieldByPath: Record<string, keyof ScheduleErrors> = {
  dayStart: "dayStart",
  dayEnd: "dayEnd",
  "workSchedule.start": "workStart",
  "workSchedule.end": "workEnd",
};

/** First validation message per schedule field; empty when valid. */
export function getScheduleErrors(settings: ScheduleSettings): ScheduleErrors {
  const result = scheduleSettingsSchema.safeParse(settings);
  const errors: ScheduleErrors = {};
  if (result.success) return errors;

  for (const issue of result.error.issues) {
    const field = fieldByPath[issue.path.join(".")];
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
