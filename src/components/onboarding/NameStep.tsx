import { useState } from "react";
import { profileNameSchema } from "@/lib/schemas";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { onboardingCopy } from "./copy";
import { OnboardingStep } from "./OnboardingStep";

type NameStepProps = {
  initialName: string;
  onNext: (name: string) => void;
};

export function NameStep({ initialName, onNext }: NameStepProps) {
  const copy = onboardingCopy.name;
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);
  const result = profileNameSchema.safeParse(name);

  return (
    <OnboardingStep
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      canSubmit={result.success}
      onSubmit={() => result.success && onNext(result.data)}
    >
      <Field label={copy.label} error={touched && !result.success ? result.error.issues[0]?.message : undefined}>
        {(controlProps) => (
          <TextInput
            {...controlProps}
            value={name}
            placeholder={copy.placeholder}
            maxLength={40}
            autoComplete="nickname"
            enterKeyHint="next"
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
          />
        )}
      </Field>
    </OnboardingStep>
  );
}
