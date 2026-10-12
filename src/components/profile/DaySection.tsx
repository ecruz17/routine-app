"use client";

import { useState } from "react";
import { Moon, Sun, SunMedium } from "lucide-react";
import type { WorkSchedule } from "@/lib/schemas";
import { crossesMidnight, formatDuration, minutesBetween } from "@/lib/time-format";
import { profileCopy } from "./copy";
import { ProfileSection } from "./ProfileSection";
import { getScheduleErrors } from "@/lib/schedule-validation";
import { TimeTile } from "./TimeTile";

type DayHours = { dayStart: string; dayEnd: string };

type DaySectionProps = DayHours & {
  /** Saved work block, so the new day hours are validated against it. */
  workSchedule: WorkSchedule | null;
  onSave: (changes: DayHours) => void;
};

export function DaySection({ dayStart, dayEnd, workSchedule, onSave }: DaySectionProps) {
  const copy = profileCopy.day;
  const [draft, setDraft] = useState<DayHours | null>(null);
  const values = draft ?? { dayStart, dayEnd };

  const errors = getScheduleErrors({ ...values, workSchedule });
  const hasErrors = Object.keys(errors).length > 0;
  // A narrower day can push the saved work block outside of it.
  const dayError = errors.dayEnd ?? (errors.workStart ? copy.workOutsideDay : undefined);

  const handleSave = () => {
    if (draft && (draft.dayStart !== dayStart || draft.dayEnd !== dayEnd)) onSave(draft);
    setDraft(null);
  };

  return (
    <ProfileSection
      title={copy.title}
      subtitle={copy.subtitle}
      icon={<SunMedium aria-hidden className="size-5" />}
      iconTone="primary"
      isEditing={draft !== null}
      canSave={!hasErrors}
      onEdit={() => setDraft({ dayStart, dayEnd })}
      onCancel={() => setDraft(null)}
      onSave={handleSave}
    >
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        <TimeTile
          label={copy.startLabel}
          icon={<Sun aria-hidden className="size-4.5 text-tertiary" />}
          value={values.dayStart}
          isEditing={draft !== null}
          error={errors.dayStart}
          onChange={(value) => setDraft({ ...values, dayStart: value })}
        />
        <TimeTile
          label={copy.endLabel}
          icon={<Moon aria-hidden className="size-4.5 text-primary" />}
          value={values.dayEnd}
          isEditing={draft !== null}
          error={dayError}
          hint={crossesMidnight(values.dayStart, values.dayEnd) ? copy.nextDay : undefined}
          onChange={(value) => setDraft({ ...values, dayEnd: value })}
        />
      </div>
      {!hasErrors && (
        <p className="text-body-sm text-on-surface-variant">
          {copy.length(formatDuration(minutesBetween(values.dayStart, values.dayEnd)))}
        </p>
      )}
    </ProfileSection>
  );
}
