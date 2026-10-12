import { useState } from "react";
import { getScheduleErrors } from "@/lib/schedule-validation";
import { crossesMidnight, formatDuration, minutesBetween } from "@/lib/time-format";
import { Field } from "@/components/ui/Field";
import { TimeInput } from "@/components/ui/TimeInput";
import { onboardingCopy } from "./copy";
import { OnboardingStep } from "./OnboardingStep";

type DayHours = { dayStart: string; dayEnd: string };

type DayHoursStepProps = {
  initialValues: DayHours;
  onNext: (values: DayHours) => void;
};

export function DayHoursStep({ initialValues, onNext }: DayHoursStepProps) {
  const copy = onboardingCopy.dayHours;
  const [values, setValues] = useState(initialValues);
  const errors = getScheduleErrors({ ...values, workSchedule: null });
  const isValid = Object.keys(errors).length === 0;

  return (
    <OnboardingStep
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      canSubmit={isValid}
      onSubmit={() => onNext(values)}
    >
      <div className="grid grid-cols-2 gap-space-sm">
        <Field label={copy.startLabel} error={errors.dayStart}>
          {(controlProps) => (
            <TimeInput {...controlProps} value={values.dayStart} onChange={(dayStart) => setValues({ ...values, dayStart })} />
          )}
        </Field>
        <Field
          label={copy.endLabel}
          error={errors.dayEnd}
          hint={crossesMidnight(values.dayStart, values.dayEnd) ? copy.nextDay : undefined}
        >
          {(controlProps) => (
            <TimeInput {...controlProps} value={values.dayEnd} onChange={(dayEnd) => setValues({ ...values, dayEnd })} />
          )}
        </Field>
      </div>
      {isValid && (
        <p className="rounded-lg bg-primary-fixed/40 p-space-md text-body-md text-on-primary-fixed-variant">
          {copy.length(formatDuration(minutesBetween(values.dayStart, values.dayEnd)))}
        </p>
      )}
    </OnboardingStep>
  );
}
