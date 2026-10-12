import { Pencil } from "lucide-react";
import { routineCopy } from "./copy";

type TaskEditButtonProps = {
  taskTitle: string;
  onClick: () => void;
};

export function TaskEditButton({ taskTitle, onClick }: TaskEditButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={routineCopy.editTaskLabel(taskTitle)}
      className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Pencil aria-hidden className="size-4.5" />
      <span aria-hidden className="hidden sm:inline">
        {routineCopy.edit}
      </span>
    </button>
  );
}
