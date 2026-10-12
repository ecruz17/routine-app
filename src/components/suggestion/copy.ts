export const suggestionCopy = {
  title: "Rutina propuesta para el",
  subtitle: "Revisa los horarios y ajusta lo que necesites antes de confirmar.",

  timeline: {
    title: "Cronograma del día",
    hint: "Toca Editar para ajustar una tarea",
    label: "Tareas propuestas en orden de inicio",
  },

  review: {
    title: "Revisión de tu plan",
    noOverlap: "Ninguna tarea se cruza con otra",
    overlap: (count: number) => `${count} ${count === 1 ? "tarea se cruza" : "tareas se cruzan"} con otras`,
    workRespected: "Tu horario laboral está libre",
    workConflict: (count: number) =>
      `${count} ${count === 1 ? "tarea choca" : "tareas chocan"} con tu horario laboral`,
    withinDay: (start: string, end: string) => `Todo ocurre entre ${start} y ${end}`,
    outsideDay: (count: number) => `${count} ${count === 1 ? "tarea queda" : "tareas quedan"} fuera de tu día`,
  },

  actions: {
    status: "Rutina pendiente de confirmar",
    cancel: "Cancelar",
    confirm: "Confirmar",
  },

  empty: {
    title: "No hay una propuesta pendiente",
    description: "Describe tu día en Inicio y la IA organizará una rutina para ti.",
    action: "Ir a Inicio",
  },
} as const;
