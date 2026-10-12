import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { inputClasses, type InputAccent } from "./inputStyles";

type TextInputProps = ComponentPropsWithRef<"input"> & {
  accent?: InputAccent;
};

export function TextInput({ accent = "primary", className, type = "text", ...props }: TextInputProps) {
  return <input type={type} className={inputClasses(accent, cn("min-h-11 py-space-sm", className))} {...props} />;
}
