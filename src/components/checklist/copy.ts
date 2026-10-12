export const checklistCopy = {
  daySelectorTitle: "Seleccionar jornada a consultar",
  dayCaption: {
    done: "Completado",
    withRoutine: "Con rutina",
  },

  status: {
    today: "Día en curso",
    upcoming: "Próximamente",
    past: "Día pasado",
    completed: "¡Tareas completadas!",
  },
  subtitle: "Marca cada tarea a medida que la completes.",
  progressLabel: "Progreso de la rutina",
  progressSummary: (completed: number, total: number) => `${completed} de ${total} tareas completadas`,

  list: {
    title: "Tus tareas",
    label: "Tareas de la rutina en orden de inicio",
  },

  summary: {
    title: "Resumen del día",
    next: "Siguiente tarea",
    allDone: "No quedan tareas pendientes",
    planned: "Tiempo planificado",
    completedTime: "Tiempo completado",
  },

  celebration: {
    title: "¡Tareas completadas!",
    message: (name: string) => `¡Excelente trabajo, ${name}! Cumpliste toda tu rutina.`,
    completion: "Cumplimiento",
    tasks: "Tareas",
    tasksValue: (total: number) => `${total} de ${total}`,
    close: "Cerrar",
    action: "¡Genial!",
  },

  empty: {
    title: "No hay una rutina para este día",
    description: "Describe tu día en Inicio y confirma la propuesta para verla aquí.",
    action: "Ir a Inicio",
  },
} as const;
