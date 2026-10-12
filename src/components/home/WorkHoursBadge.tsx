"use client";

import Link from "next/link";
import { BriefcaseBusiness, Shield, Sun } from "lucide-react";
import { isWeekend } from "@/lib/dates";
import { to12h } from "@/lib/time-format";
import { useRequiredProfile } from "@/hooks/useProfile";
import { buttonClasses } from "@/components/ui/Button";
import { homeCopy } from "./copy";

type WorkHoursBadgeProps = {
  /** Day being planned ("YYYY-MM-DD"); the work block only applies Mon–Fri. */
  date: string;
};

/** Work hours for the selected day, read live from the stored profile. */
export function WorkHoursBadge({ date }: WorkHoursBadgeProps) {
  const { workSchedule, dayStart, dayEnd } = useRequiredProfile();
  const copy = homeCopy.workHours;

  // Work block on weekdays; otherwise the whole day (from the profile) is free for the AI.
  const appliesToday = workSchedule !== null && !isWeekend(date);
  const range = appliesToday ? workSchedule : { start: dayStart, end: dayEnd };
  const { Icon, title } = appliesToday
    ? { Icon: Shield, title: copy.title }
    : workSchedule
      ? { Icon: Sun, title: copy.weekendTitle }
      : { Icon: BriefcaseBusiness, title: copy.noScheduleTitle };

  return (
    <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-low px-space-md py-space-sm shadow-level-1">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="text-label-md text-on-surface">{title}</span>
        <span className="text-body-sm text-on-surface-variant">
          {!appliesToday && `${copy.freeDayPrefix} `}
          <span className="font-semibold text-primary">
            {to12h(range.start)} – {to12h(range.end)}
          </span>
        </span>
      </div>
      <Link href="/profile" className={buttonClasses({ className: "ml-auto min-h-9 px-space-sm text-label-sm" })}>
        {workSchedule ? copy.edit : copy.add}
      </Link>
    </div>
  );
}
