import { z } from "zod";
import { minutesBetween } from "@/lib/time-format";

/** "HH:mm" 24h time. */
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: "Elige una hora válida" });

/** "YYYY-MM-DD" local calendar date. */
export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** How the user wants to be called. */
export const profileNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Escribe cómo quieres que te llamemos" })
  .max(40, { error: "Usa 40 caracteres o menos" });

export const workScheduleSchema = z.object({
  start: timeSchema,
  end: timeSchema,
});

export const userProfileSchema = z.object({
  name: profileNameSchema,
  dayStart: timeSchema,
  dayEnd: timeSchema,
  workSchedule: workScheduleSchema.nullable(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string(),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: timeSchema,
  durationMinutes: z.number().int().positive(),
  completed: z.boolean(),
  completedAt: z.string().optional(),
});

export const routineSchema = z.object({
  id: z.string(),
  date: dateKeySchema,
  status: z.enum(["draft", "confirmed"]),
  tasks: z.array(taskSchema),
  rawInput: z.object({ userTasks: z.string(), events: z.string() }),
  createdAt: z.string(),
});

/** Fields the user can change in the task editor. */
export const taskEditSchema = z.object({
  title: z.string().trim().min(1, { error: "Escribe un nombre para la tarea" }),
  startTime: timeSchema.or(z.literal("")).refine((value) => value !== "", {
    error: "Elige una hora de inicio",
  }),
  durationMinutes: z
    .number({ error: "Indica la duración en minutos" })
    .int({ error: "Usa minutos enteros" })
    .min(5, { error: "La duración mínima es de 5 minutos" })
    .max(720, { error: "La duración máxima es de 12 horas" }),
});

/**
 * Schedule fields editable in Profile (and Onboarding). The day may end after
 * midnight (e.g. 08:00 → 01:00), so times are compared as minutes since the
 * day starts. The work block must start before it ends and fit inside the day
 * (which also allows night shifts inside a late day, e.g. 18:00 → 00:30).
 */
export const scheduleSettingsSchema = userProfileSchema
  .pick({ dayStart: true, dayEnd: true, workSchedule: true })
  .superRefine(({ dayStart, dayEnd, workSchedule }, ctx) => {
    const dayLength = minutesBetween(dayStart, dayEnd);
    if (dayLength === 0) {
      ctx.addIssue({ code: "custom", path: ["dayEnd"], message: "El fin del día debe ser distinto del inicio" });
      return;
    }
    if (!workSchedule) return;

    const workStart = minutesBetween(dayStart, workSchedule.start);
    const workEnd = minutesBetween(dayStart, workSchedule.end);
    const outsideDay = {
      code: "custom" as const,
      path: ["workSchedule", "start"],
      message: "Tu horario laboral debe quedar dentro de tu día",
    };

    if (workStart >= dayLength) {
      ctx.addIssue(outsideDay);
    } else if (workEnd <= workStart) {
      ctx.addIssue({ code: "custom", path: ["workSchedule", "end"], message: "La salida debe ser después de la entrada" });
    } else if (workEnd > dayLength) {
      ctx.addIssue(outsideDay);
    }
  });

export type ScheduleSettings = z.infer<typeof scheduleSettingsSchema>;
export type WorkSchedule = z.infer<typeof workScheduleSchema>;
export type TaskEdit = z.infer<typeof taskEditSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Routine = z.infer<typeof routineSchema>;
