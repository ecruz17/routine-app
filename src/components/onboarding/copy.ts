export const onboardingCopy = {
  progress: (step: number, total: number) => `Paso ${step} de ${total}`,
  back: "Volver",
  next: "Continuar",

  name: {
    eyebrow: "Tu identidad",
    title: "¿Cómo te gustaría que te llamemos?",
    description: "Así te saludaremos cada vez que organices tu día.",
    label: "Tu nombre o apodo",
    placeholder: "Ej. Tam",
  },

  dayHours: {
    eyebrow: "Tus horas activas",
    title: "¿Cuándo empieza y termina tu día?",
    description: "Usaremos este rango para organizar tus tareas entre semana.",
    startLabel: "Inicio del día",
    endLabel: "Fin del día",
    length: (duration: string) => `${duration} disponibles para tus tareas`,
    nextDay: "Del día siguiente",
  },

  work: {
    eyebrow: "Horario fijo · Opcional",
    title: "¿Tienes un horario de trabajo o escuela?",
    description: "Reservaremos este bloque de lunes a viernes para que la IA no agende tareas en él.",
    startLabel: "Desde",
    endLabel: "Hasta",
    daysLabel: "Se aplica estos días",
    skip: "No tengo un horario fijo",
  },

  done: {
    eyebrow: "Listo",
    title: (name: string) => `¡Todo listo, ${name}!`,
    description: "Ya puedes describir tu día y la IA lo organizará por ti. Puedes cambiar estos datos en Perfil.",
    summaryDay: "Tu día",
    summaryWork: "Horario laboral",
    noWork: "Sin horario fijo",
    finish: "Organizar mi día",
  },
} as const;
