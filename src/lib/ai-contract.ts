/**
 * The organizer backend's request/response contract (see CLAUDE.md "AI
 * integration"). Do not change field names or formats: the Lambda owns them.
 */
import { z } from "zod";

/** POST body: all strings, times in the backend's 12h style ("8 a.m."). */
export const organizeRequestSchema = z.object({
  userTasks: z.string().trim().min(1).max(2000),
  startDayTime: z.string().min(1).max(20),
  endDayTime: z.string().min(1).max(20),
  /** "9 a.m. to 5 p.m.", or "" on weekends / without a work schedule. */
  workingHours: z.string().max(50),
  events: z.string().max(2000),
});

/** Raw response shape only; the values are parsed tolerantly when mapping to Task. */
export const organizeResponseSchema = z.object({
  organizedTasks: z.array(
    z.object({
      taskName: z.string(),
      suggestedStartTime: z.string(),
      estimatedDuration: z.string(),
    }),
  ),
});

export type OrganizeRequest = z.infer<typeof organizeRequestSchema>;
export type OrganizeResponse = z.infer<typeof organizeResponseSchema>;

/** Same-origin proxy that adds the API key server-side (src/app/api/organize/route.ts). */
export const ORGANIZE_ENDPOINT = "/api/organize";

/** Error codes returned by the proxy, so the client can show the right message. */
export type OrganizeProxyError = "invalid_request" | "rate_limited" | "upstream_error" | "timeout" | "not_configured";
