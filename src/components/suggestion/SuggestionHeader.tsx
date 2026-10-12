import { Sparkles } from "lucide-react";
import { formatLongDayLabel } from "@/lib/dates";
import { Card } from "@/components/ui/Card";
import { suggestionCopy } from "./copy";

type SuggestionHeaderProps = {
  date: string;
};

export function SuggestionHeader({ date }: SuggestionHeaderProps) {
  return (
    <Card as="section" className="flex items-start gap-space-md md:items-center">
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container shadow-level-2">
        <Sparkles aria-hidden className="size-6" />
        <span aria-hidden className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
      </span>
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-display text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {suggestionCopy.title} <span className="text-primary">{formatLongDayLabel(date)}</span>
        </h1>
        <p className="text-body-md text-on-surface-variant">{suggestionCopy.subtitle}</p>
      </div>
    </Card>
  );
}
