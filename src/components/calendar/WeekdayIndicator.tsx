import { cn } from "@/lib/cn";
import { calendarCopy } from "./copy";

type WeekdayIndicatorProps = {
  label: string;
};

/** Read-only Mon–Sun row highlighting the weekdays the work block applies to. */
export function WeekdayIndicator({ label }: WeekdayIndicatorProps) {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="text-label-sm tracking-wider text-on-surface-variant uppercase">{label}</span>
      <ul className="grid grid-cols-7 gap-1.5">
        {calendarCopy.weekdays.map(({ short, name, workday }) => (
          <li
            key={name}
            className={cn(
              "flex h-10 items-center justify-center rounded-lg text-label-md",
              workday ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant",
            )}
          >
            <span aria-hidden>{short}</span>
            <span className="sr-only">
              {name}: {workday ? calendarCopy.workdayActive : calendarCopy.workdayInactive}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
