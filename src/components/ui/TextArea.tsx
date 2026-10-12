import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { inputClasses, type InputAccent } from "./inputStyles";

type TextAreaProps = ComponentPropsWithRef<"textarea"> & {
  accent?: InputAccent;
};

export function TextArea({ accent = "primary", className, ...props }: TextAreaProps) {
  return <textarea className={inputClasses(accent, cn("resize-none py-space-md", className))} {...props} />;
}
