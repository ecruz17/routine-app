"use client";

import { useId, useState, type FormEvent } from "react";
import { profileNameSchema } from "@/lib/schemas";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { profileCopy } from "./copy";
import { EditControls } from "./EditControls";

type ProfileHeroProps = {
  name: string;
  onSaveName: (name: string) => void;
};

export function ProfileHero({ name, onSaveName }: ProfileHeroProps) {
  const copy = profileCopy.name;
  const formId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const isEditing = draft !== null;

  const result = profileNameSchema.safeParse(draft ?? name);
  const error = isEditing && !result.success ? result.error.issues[0]?.message : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!result.success) return;
    if (result.data !== name) onSaveName(result.data);
    setDraft(null);
  };

  return (
    <Card as="section" className="flex flex-col items-center gap-space-md sm:flex-row md:gap-space-lg">
      {/* Avatar follows the draft so the initials preview while typing. */}
      <Avatar name={result.success ? result.data : name} size="xl" className="shadow-level-2 ring-4 ring-surface-container-lowest" />

      <div className="flex w-full min-w-0 flex-col gap-space-xs text-center sm:text-left">
        {isEditing ? (
          <form id={formId} noValidate onSubmit={handleSubmit}>
            <Field label={copy.label} error={error} hint={copy.hint}>
              {(controlProps) => (
                <TextInput
                  {...controlProps}
                  value={draft}
                  maxLength={40}
                  autoComplete="nickname"
                  // Focus moves here right after the user pressed "Editar".
                  autoFocus
                  onChange={(event) => setDraft(event.target.value)}
                  className="font-display text-title-sm"
                />
              )}
            </Field>
          </form>
        ) : (
          <>
            <h1 className="font-display text-display-lg-mobile tracking-tight break-words text-on-surface md:text-display-lg">
              {name}
            </h1>
            <p className="text-body-lg text-on-surface-variant">{profileCopy.subtitle}</p>
          </>
        )}
      </div>

      <div className="self-center sm:self-start">
        <EditControls
          section={copy.section}
          isEditing={isEditing}
          formId={formId}
          canSave={result.success}
          onEdit={() => setDraft(name)}
          onCancel={() => setDraft(null)}
        />
      </div>
    </Card>
  );
}
