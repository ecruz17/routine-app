const MINUTES_PER_DAY = 24 * 60;

/** "07:30" → 450 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** 450 → "07:30". Wraps past midnight. */
export function minutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Minutes from `from` forward to `to`, wrapping past midnight:
 * ("08:00", "17:00") → 540, ("23:00", "01:00") → 120, equal times → 0.
 */
export function minutesBetween(from: string, to: string): number {
  return (((timeToMinutes(to) - timeToMinutes(from)) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/** True when a range ends on the next calendar day ("22:00" → "01:00"). */
export function crossesMidnight(start: string, end: string): boolean {
  return timeToMinutes(end) < timeToMinutes(start);
}

/** "23:30" + 45 → "00:15" */
export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

/**
 * Formats a "HH:mm" 24h time as the 12h style shared with the backend:
 * "17:00" → "5 p.m.", "07:30" → "7:30 a.m.", "00:00" → "12 a.m.".
 */
export function to12h(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours < 12 ? "a.m." : "p.m.";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutePart = minutes === 0 ? "" : `:${String(minutes).padStart(2, "0")}`;
  return `${hour12}${minutePart} ${period}`;
}

/** "8 a.m. – 8:45 a.m." */
export function formatTimeRange(start: string, durationMinutes: number): string {
  return `${to12h(start)} – ${to12h(addMinutesToTime(start, durationMinutes))}`;
}

/** UI duration style: 45 → "45 min", 60 → "1 h", 90 → "1 h 30 min". */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

/* ---------- Parsers for AI output (tolerant: values come from a model) ---------- */

const pad2 = (value: number) => String(value).padStart(2, "0");

/**
 * Parses a 12h or 24h time into "HH:mm", or null if it can't be understood.
 * Accepts "8 a.m.", "5:15 p.m.", "8am", "8 AM", "8:00 a. m.", "20:00", "20:00 hrs".
 * "12 a.m." → "00:00", "12 p.m." → "12:00".
 */
export function parseTime(input: string): string | null {
  // "8:00 a. m." → "8:00am", "5:15 P.M." → "5:15pm", "20:00 hrs" → "20:00"
  const normalized = input
    .toLowerCase()
    .replace(/[\s.]/g, "")
    .replace(/(hrs?|h)$/, "");
  const match = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/.exec(normalized);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = match[2] === undefined ? 0 : Number(match[2]);
  const period = match[3];
  if (minutes > 59) return null;

  if (period) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (period === "pm" ? 12 : 0);
  } else if (hours > 23 || match[2] === undefined) {
    // Without a.m./p.m. require "HH:mm" so a bare "8" isn't guessed.
    return null;
  }
  return `${pad2(hours)}:${pad2(minutes)}`;
}

// Longest alternatives first so "minutos" isn't read as "m", "horas" as "h".
const DURATION_PART = /(\d+(?:\.\d+)?)\s*(horas|hora|hrs|hr|h|minutos|minuto|mins|min|m)(?![a-záéíóúñ])/g;

/**
 * Parses a Spanish duration into whole minutes, or null if it can't be understood.
 * Accepts "30 minutos", "1 minuto", "1 hora", "2 horas", "1 hora 30 minutos",
 * "1 hora y 30 minutos", "1.5 horas", "1,5 horas", "90 min", "1 h 30 min",
 * "media hora", "1 hora y media".
 */
export function parseDuration(input: string): number | null {
  const normalized = input.toLowerCase().trim().replace(/(\d),(\d)/g, "$1.$2");
  if (/^media hora$/.test(normalized)) return 30;

  let total = 0;
  let matched = false;
  for (const [, amount, unit] of normalized.matchAll(DURATION_PART)) {
    matched = true;
    total += Number(amount) * (unit.startsWith("h") ? 60 : 1);
  }
  if (!matched) return null;
  if (/\by media\b/.test(normalized)) total += 30;

  const minutes = Math.round(total);
  return minutes > 0 ? minutes : null;
}
