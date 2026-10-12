import { useId } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatMonthYear, getWeekDays, isWeekend } from "@/lib/dates";
import { calendarCopy } from "./copy";
import { DayCard, type DayCaption } from "./DayCard";

type DaySelectorProps = {
  title: string;
  weekStart: string;
  selectedDate: string;
  today: string;
  onSelect: (date: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  /** Caption under the day number. Defaults to "Mañana" / "Fin de sem.". */
  getCaption?: (date: string) => DayCaption | null;
};

const navButtonClass =
  "flex size-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary";

export function DaySelector({
  title,
  weekStart,
  selectedDate,
  today,
  onSelect,
  onPreviousWeek,
  onNextWeek,
  getCaption,
}: DaySelectorProps) {
  const titleId = useId();
  const tomorrow = addDays(today, 1);

  const defaultCaption = (date: string): DayCaption | null => {
    if (date === tomorrow) return { text: calendarCopy.tomorrow, tone: "accent" };
    if (isWeekend(date)) return { text: calendarCopy.weekend };
    return null;
  };

  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between gap-space-sm">
        <h2 id={titleId} className="text-label-md tracking-wider text-outline uppercase">
          {title}
        </h2>
        <div className="flex items-center rounded-lg bg-surface-container-low">
          <button type="button" aria-label={calendarCopy.previousWeek} onClick={onPreviousWeek} className={navButtonClass}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <span className="hidden items-center gap-1.5 px-1 text-label-md text-on-surface sm:flex">
            <CalendarDays aria-hidden className="size-4.5 text-primary" />
            {formatMonthYear(weekStart)}
          </span>
          <button type="button" aria-label={calendarCopy.nextWeek} onClick={onNextWeek} className={navButtonClass}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-labelledby={titleId}
        className="-mx-margin flex snap-x gap-space-sm overflow-x-auto px-margin pt-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0"
      >
        {getWeekDays(weekStart).map((date) => (
          <DayCard
            key={date}
            date={date}
            isSelected={date === selectedDate}
            isToday={date === today}
            caption={(getCaption ?? defaultCaption)(date)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
