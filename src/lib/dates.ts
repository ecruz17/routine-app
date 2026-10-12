/**
 * Calendar date helpers. Dates are "YYYY-MM-DD" keys in the user's local
 * timezone; never derive them from toISOString() (UTC can shift the day).
 */

const pad = (value: number) => String(value).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a "YYYY-MM-DD" key as a local date at midnight. */
export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(key: string, amount: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

/** Monday of the week containing the given date. */
export function startOfWeek(key: string): string {
  const offsetFromMonday = (fromDateKey(key).getDay() + 6) % 7;
  return addDays(key, -offsetFromMonday);
}

/** The seven date keys of the week starting at `weekStart` (Monday first). */
export function getWeekDays(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function isWeekend(key: string): boolean {
  const day = fromDateKey(key).getDay();
  return day === 0 || day === 6;
}

const capitalize = (text: string) =>
  text.charAt(0).toLocaleUpperCase("es") + text.slice(1);

const weekdayFormat = new Intl.DateTimeFormat("es", { weekday: "long" });
const shortWeekdayFormat = new Intl.DateTimeFormat("es", { weekday: "short" });
const monthFormat = new Intl.DateTimeFormat("es", { month: "long" });

/** "Lunes" */
export function formatWeekday(key: string): string {
  return capitalize(weekdayFormat.format(fromDateKey(key)));
}

/** "Lun" */
export function formatShortWeekday(key: string): string {
  return capitalize(shortWeekdayFormat.format(fromDateKey(key)).replace(".", ""));
}

/** "Lunes 12 de Octubre" */
export function formatLongDayLabel(key: string): string {
  const date = fromDateKey(key);
  return `${formatWeekday(key)} ${date.getDate()} de ${capitalize(monthFormat.format(date))}`;
}

/** "Octubre 2026" */
export function formatMonthYear(key: string): string {
  const date = fromDateKey(key);
  return `${capitalize(monthFormat.format(date))} ${date.getFullYear()}`;
}

export function getDayOfMonth(key: string): number {
  return fromDateKey(key).getDate();
}
