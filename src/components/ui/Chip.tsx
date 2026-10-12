import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ChipTone = "primary" | "secondary" | "neutral" | "muted" | "warning";
type ChipSize = "sm" | "md";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: ChipTone;
  size?: ChipSize;
};

const toneClasses: Record<ChipTone, string> = {
  primary: "bg-indigo-50 text-indigo-600",
  secondary: "bg-secondary-container/40 text-on-secondary-container",
  neutral: "bg-surface-container text-on-surface-variant",
  muted: "bg-surface-container-highest text-on-surface",
  warning: "bg-warning-container text-on-warning-container",
};

const sizeClasses: Record<ChipSize, string> = {
  sm: "h-6 px-2",
  md: "h-7 px-2.5",
};

export function Chip({ tone = "neutral", size = "md", className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-space-xs rounded-full text-body-sm font-medium whitespace-nowrap",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
