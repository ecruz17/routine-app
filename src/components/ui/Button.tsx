import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "success";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-level-2 hover:bg-primary-hover focus-visible:outline-primary",
  secondary:
    "border-[1.5px] border-border-input bg-surface-container-lowest text-slate-700 hover:bg-slate-100 focus-visible:outline-primary",
  success:
    "bg-success text-white shadow-level-1 hover:bg-secondary focus-visible:outline-success",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-space-md text-label-md",
  lg: "min-h-12 px-space-lg text-label-md",
};

/** Button look, also usable on links (e.g. a `<Link>` styled as a button). */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-space-sm rounded-lg font-display transition-all",
    "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {isLoading ? (
        <Loader2 aria-hidden className="size-5 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
