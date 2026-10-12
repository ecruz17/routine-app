import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type EmptyRoutineStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: "/home";
};

export function EmptyRoutineState({ title, description, actionLabel, actionHref }: EmptyRoutineStateProps) {
  return (
    <Card className="flex flex-col items-center gap-space-sm py-space-xl text-center">
      <span className="flex size-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
        <CalendarX2 aria-hidden className="size-6" />
      </span>
      <h1 className="font-display text-headline-md text-on-surface">{title}</h1>
      <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>
      <Link href={actionHref} className={buttonClasses({ className: "mt-space-sm" })}>
        {actionLabel}
      </Link>
    </Card>
  );
}
