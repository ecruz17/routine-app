import type { ComponentPropsWithRef } from "react";
import { TextInput } from "./TextInput";

type TimeInputProps = Omit<ComponentPropsWithRef<"input">, "type" | "value" | "onChange"> & {
  /** "HH:mm" 24h, or "" when empty. The browser renders it in the user's locale. */
  value: string;
  onChange: (value: string) => void;
};

export function TimeInput({ value, onChange, ...props }: TimeInputProps) {
  return (
    <TextInput
      type="time"
      step={300}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  );
}
