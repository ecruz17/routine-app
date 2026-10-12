import { cn } from "@/lib/cn";

export type InputAccent = "primary" | "secondary";

const accentClasses: Record<InputAccent, string> = {
  primary: "focus:border-primary focus:shadow-focus-primary",
  secondary: "focus:border-success focus:shadow-focus-secondary",
};

/** Shared DESIGN.md input look for text inputs and text areas. */
export function inputClasses(accent: InputAccent = "primary", className?: string): string {
  return cn(
    "w-full rounded-lg border-[1.5px] border-border-input bg-surface-container-lowest px-space-md",
    "text-body-lg text-on-surface outline-none transition-[border-color,box-shadow] placeholder:text-outline sm:text-body-md",
    "disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant",
    "aria-invalid:border-error aria-invalid:focus:shadow-[0_0_0_4px_rgb(186_26_26/0.15)]",
    accentClasses[accent],
    className,
  );
}
