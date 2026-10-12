import { BatteryCharging, Lightbulb, LockKeyhole, Timer, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { homeCopy, type AiTip } from "./copy";

type AiTipsPanelProps = {
  tips: readonly AiTip[];
};

const tipIcons: Record<AiTip["icon"], { icon: LucideIcon; className: string }> = {
  timer: { icon: Timer, className: "text-secondary" },
  energy: { icon: BatteryCharging, className: "text-primary" },
  lock: { icon: LockKeyhole, className: "text-tertiary" },
};

export function AiTipsPanel({ tips }: AiTipsPanelProps) {
  const copy = homeCopy.tips;

  return (
    <Card as="aside" aria-labelledby="ai-tips-title" className="flex flex-col gap-space-md">
      <div className="flex items-center gap-space-sm">
        <span className="flex size-9 items-center justify-center rounded-lg bg-tertiary-fixed text-tertiary">
          <Lightbulb aria-hidden className="size-5" />
        </span>
        <div>
          <h2 id="ai-tips-title" className="font-display text-title-sm text-on-surface">
            {copy.title}
          </h2>
          <p className="text-body-sm text-outline">{copy.subtitle}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-space-sm">
        {tips.map((tip) => {
          const { icon: Icon, className } = tipIcons[tip.icon];
          return (
            <li key={tip.id} className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3">
              <span className="flex items-center gap-space-sm text-label-md text-on-surface">
                <Icon aria-hidden className={`size-4 shrink-0 ${className}`} />
                {tip.title}
              </span>
              <p className="text-body-sm text-on-surface-variant">
                {tip.lead} <span className="font-semibold text-primary">{tip.example}</span>.
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
