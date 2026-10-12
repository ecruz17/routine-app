import { useState } from "react";
import { getScheduleErrors } from "@/lib/schedule-validation";
import type { WorkSchedule } from "@/lib/schemas";
import { WeekdayIndicator } from "@/components/calendar/WeekdayIndicator";
import { buttonClasses } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { TimeInput } from "@/components/ui/TimeInput";
import { onboardingCopy } from "./copy";
import { OnboardingStep } from "./OnboardingStep";

type WorkScheduleStepProps = {
  dayStart: string;
  dayEnd: string;
  initialValues: WorkSchedule;
  /** `null` when the user skips the step. */
  onNext: (workSchedule: WorkSchedule | null) => void;
};

export function WorkScheduleStep({ dayStart, dayEnd, initialValues, onNext }: WorkScheduleStepProps) {
  const copy = onboardingCopy.work;
  const [values, setValues] = useState(initialValues);
  const errors = getScheduleErrors({ dayStart, dayEnd, workSchedule: values });

  return (
    <OnboardingStep
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      canSubmit={Object.keys(errors).length === 0}
      onSubmit={() => onNext(values)}
      secondaryAction={
        <button
          type="button"
          onClick={() => onNext(null)}
          className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full" })}
        >
          {copy.skip}
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-space-sm">
        <Field label={copy.startLabel} error={errors.workStart}>
          {(controlProps) => (
            <TimeInput {...controlProps} value={values.start} onChange={(start) => setValues({ ...values, start })} />
          )}
        </Field>
        <Field label={copy.endLabel} error={errors.workEnd}>
          {(controlProps) => (
            <TimeInput {...controlProps} value={values.end} onChange={(end) => setValues({ ...values, end })} />
          )}
        </Field>
      </div>
      <WeekdayIndicator label={copy.daysLabel} />
    </OnboardingStep>
  );
}
