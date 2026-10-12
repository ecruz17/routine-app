import type { TaskIssue } from "@/lib/routine";

export const routineCopy = {
  edit: "Editar",
  editTaskLabel: (title: string) => `Editar ${title}`,
  checkTaskLabel: (title: string) => `Marcar “${title}” como completada`,
  status: {
    done: "Hecha",
    pending: "Pendiente",
  },

  issues: {
    overlap: "Se cruza con otra tarea",
    workSchedule: "Choca con tu horario laboral",
    outsideDay: "Fuera de tu día",
  } satisfies Record<TaskIssue, string>,

  workBlock: {
    title: "Horario laboral",
    badge: "Reservado",
    note: "La IA no agenda tareas aquí",
  },

  editor: {
    title: "Modificar tarea",
    titleLabel: "Nombre de la tarea",
    startTimeLabel: "Hora de inicio",
    durationLabel: "Duración (minutos)",
    endsAt: (time: string) => `Termina a las ${time}`,
    cancel: "Descartar",
    save: "Guardar cambios",
    close: "Cerrar",
  },
} as const;
