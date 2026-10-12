"use client";

import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import type { WorkSchedule } from "@/lib/schemas";
import { formatDuration, minutesBetween, to12h } from "@/lib/time-format";
import { Switch } from "@/components/ui/Switch";
import { profileCopy } from "./copy";
import { ProfileSection } from "./ProfileSection";
import { getScheduleErrors } from "@/lib/schedule-validation";
import { TimeTile } from "./TimeTile";
import { WeekdayIndicator } from "@/components/calendar/WeekdayIndicator";

type WorkSectionProps = {
  /** Saved day hours, so the work block is validated against them. */
  dayStart: string;
  dayEnd: string;
  workSchedule: WorkSchedule | null;
  onSave: (workSchedule: WorkSchedule | null) => void;
};

/** Times are kept while the switch is off so turning it back on restores them. */
type WorkDraft = { enabled: boolean; start: string; end: string };

const DEFAULT_WORK_SCHEDULE: WorkSchedule = { start: "09:00", end: "17:00" };

export function WorkSection({ dayStart, dayEnd, workSchedule, onSave }: WorkSectionProps) {
  const copy = profileCopy.work;
  const [draft, setDraft] = useState<WorkDraft | null>(null);
  const isEditing = draft !== null;

  const saved: WorkDraft = { enabled: workSchedule !== null, ...(workSchedule ?? DEFAULT_WORK_SCHEDULE) };
  const values = draft ?? saved;
  const nextSchedule = values.enabled ? { start: values.start, end: values.end } : null;
  const errors = getScheduleErrors({ dayStart, dayEnd, workSchedule: nextSchedule });

  const handleSave = () => {
    const changed =
      nextSchedule?.start !== workSchedule?.start || nextSchedule?.end !== workSchedule?.end;
    if (changed) onSave(nextSchedule);
    setDraft(null);
  };

  return (
    <ProfileSection
      title={copy.title}
      subtitle={copy.subtitle}
      icon={<BriefcaseBusiness aria-hidden className="size-5" />}
      iconTone="secondary"
      isEditing={isEditing}
      canSave={Object.keys(errors).length === 0}
      onEdit={() => setDraft(saved)}
      onCancel={() => setDraft(null)}
      onSave={handleSave}
    >
      {isEditing && (
        <Switch
          label={copy.toggleLabel}
          description={copy.toggleDescription}
          checked={values.enabled}
          onChange={(enabled) => setDraft({ ...values, enabled })}
        />
      )}

      {!values.enabled ? (
        <p className="rounded-lg bg-surface-container-low p-space-md text-body-md text-on-surface-variant">{copy.empty}</p>
      ) : (
        <>
          <WeekdayIndicator label={copy.daysLabel} />
          {isEditing ? (
            <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
              <TimeTile
                label={copy.startLabel}
                value={values.start}
                isEditing
                error={errors.workStart}
                onChange={(start) => setDraft({ ...values, start })}
              />
              <TimeTile
                label={copy.endLabel}
                value={values.end}
                isEditing
                error={errors.workEnd}
                onChange={(end) => setDraft({ ...values, end })}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-space-xs rounded-lg bg-surface-container-low p-space-md">
              <span className="flex flex-wrap items-center justify-between gap-space-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                {copy.windowLabel}
                <span className="tracking-normal text-primary normal-case">
                  {copy.reserved(formatDuration(minutesBetween(values.start, values.end)))}
                </span>
              </span>
              <span className="font-display text-headline-md text-on-surface">
                {to12h(values.start)} – {to12h(values.end)}
              </span>
            </div>
          )}
        </>
      )}
    </ProfileSection>
  );
}
