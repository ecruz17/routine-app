import { cn } from "@/lib/cn";
import { formatLongDayLabel, formatWeekday, getDayOfMonth } from "@/lib/dates";
import { calendarCopy } from "./copy";

export type DayCaption = {
  text: string;
  tone?: "accent" | "muted";
};

type DayCardProps = {
  date: string;
  isSelected: boolean;
  isToday: boolean;
  caption?: DayCaption | null;
  onSelect: (date: string) => void;
};

export function DayCard({ date, isSelected, isToday, caption, onSelect }: DayCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={[formatLongDayLabel(date), isToday && calendarCopy.today, caption?.text].filter(Boolean).join(", ")}
      onClick={() => onSelect(date)}
      className={cn(
        "relative flex min-h-24 w-20 shrink-0 snap-start flex-col items-center justify-center rounded-xl p-space-sm transition-all md:w-auto",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isSelected
          ? "bg-primary text-on-primary shadow-level-2 md:scale-[1.02]"
          : "border border-border-subtle bg-surface-container-lowest text-on-surface shadow-level-1 hover:bg-surface-container-high",
      )}
    >
      {isToday && (
        <span className="absolute -top-2.5 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container uppercase shadow-sm">
          {calendarCopy.today}
        </span>
      )}
      <span className={cn("text-label-sm", isSelected ? "text-on-primary/80" : "text-outline")}>
        {formatWeekday(date)}
      </span>
      <span className="mt-0.5 font-display text-headline-md font-bold">{getDayOfMonth(date)}</span>
      {caption && (
        <span
          className={cn(
            "mt-1 text-[10px] font-medium",
            isSelected ? "text-on-primary/90" : caption.tone === "accent" ? "text-secondary" : "text-outline",
          )}
        >
          {caption.text}
        </span>
      )}
    </button>
  );
}
