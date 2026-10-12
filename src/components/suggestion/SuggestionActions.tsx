import { CircleCheck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { suggestionCopy } from "./copy";

type SuggestionActionsProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function SuggestionActions({ onCancel, onConfirm }: SuggestionActionsProps) {
  const copy = suggestionCopy.actions;

  return (
    <StickyActionBar status={copy.status}>
      <Button variant="secondary" onClick={onCancel} leftIcon={<Undo2 aria-hidden className="size-4.5" />}>
        {copy.cancel}
      </Button>
      <Button onClick={onConfirm} leftIcon={<CircleCheck aria-hidden className="size-5" />} className="sm:px-space-xl">
        {copy.confirm}
      </Button>
    </StickyActionBar>
  );
}
