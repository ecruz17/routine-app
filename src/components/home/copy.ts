export const homeCopy = {
  greeting: (name: string) => `Hola, ${name}`,
  subtitle: "Es hora de organizar tu día",

  workHours: {
    title: "Horario laboral protegido",
    weekendTitle: "Fin de semana libre",
    noScheduleTitle: "Sin horario laboral",
    /** Followed by the profile's day range, e.g. "Día libre: 8 a.m. – 11:30 p.m." */
    freeDayPrefix: "Día libre:",
    edit: "Editar",
    add: "Agregar",
  },

  daySelectorTitle: "Seleccionar jornada a planificar",

  form: {
    userTasksLabelPrefix: "El",
    userTasksLabelSuffix: "quisiera…",
    userTasksHint:
      "Escribe libremente todo lo que te gustaría realizar, sin preocuparte por el orden ni la duración.",
    userTasksPlaceholder:
      "Dar un paseo ligero, Terminar mi rompecabezas, Limpiar mi cuarto…",
    eventsLabel: "Considerando que tengo…",
    eventsHint:
      "Compromisos inamovibles, reuniones, citas médicas o momentos dedicados a la familia.",
    eventsPlaceholder: "Cita con el dentista a las 5 pm, Cena familiar a las 8 pm",
    eventsBadge: "Horas fijas",
    footerNote: "Respetamos tu horario y tus compromisos",
    submit: "Organizar rutina",
    submitting: "Organizando",
    errors: {
      generic: "No pudimos organizar tu rutina. Intenta de nuevo.",
      rateLimited: "Has hecho muchas solicitudes, intenta de nuevo en un momento",
      timeout: "La IA tardó demasiado en responder. Intenta de nuevo.",
      network: "No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.",
      noTasks: "No encontramos tareas para organizar. Intenta describirlas de otra forma.",
    },
  },

  tips: {
    title: "Consejos para la IA",
    subtitle: "Cómo obtener el mejor plan diario",
    items: [
      {
        id: "durations",
        icon: "timer",
        title: "Indica duraciones aproximadas",
        lead: "En lugar de solo decir “Hacer ejercicio”, escribe",
        example: "“Rutina de estiramientos de 30 minutos”",
      },
      {
        id: "energy",
        icon: "energy",
        title: "Menciona tu energía deseada",
        lead: "Describe cómo quieres hacer cada tarea, por ejemplo",
        example: "“paseo relajado” o “tarea de alta concentración”",
      },
      {
        id: "fixed",
        icon: "lock",
        title: "Fija horas exactas si no pueden cambiar",
        lead: "Usa el campo 2 para eventos puntuales:",
        example: "“Dentista a las 5 pm, 20 min de traslado”",
      },
    ],
  },
} as const;

export type AiTip = (typeof homeCopy.tips.items)[number];
