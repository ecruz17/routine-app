import { useId, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { EditControls } from "./EditControls";

type ProfileSectionProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconTone: "primary" | "secondary";
  isEditing: boolean;
  canSave: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
};

const iconToneClasses = {
  primary: "bg-primary-fixed text-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
};

/** Profile card whose body is a form saved by the header's "Listo" button. */
export function ProfileSection({
  title,
  subtitle,
  icon,
  iconTone,
  isEditing,
  canSave,
  onEdit,
  onCancel,
  onSave,
  children,
}: ProfileSectionProps) {
  const titleId = useId();
  const formId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSave) onSave();
  };

  return (
    <Card as="section" aria-labelledby={titleId} className="flex flex-col gap-space-lg">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-start gap-space-sm">
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", iconToneClasses[iconTone])}>
            {icon}
          </span>
          <div>
            <h2 id={titleId} className="font-display text-title-sm text-on-surface">
              {title}
            </h2>
            <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
          </div>
        </div>
        <EditControls
          section={title}
          isEditing={isEditing}
          formId={formId}
          canSave={canSave}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      </div>
      <form id={formId} noValidate onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
        {children}
      </form>
    </Card>
  );
}
