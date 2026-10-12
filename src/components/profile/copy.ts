export const profileCopy = {
  subtitle: "Perfil y configuración de rutinas",

  edit: "Editar",
  cancel: "Cancelar",
  done: "Listo",
  editSectionLabel: (section: string) => `Editar ${section}`,
  cancelSectionLabel: (section: string) => `Cancelar cambios en ${section}`,
  saveSectionLabel: (section: string) => `Guardar ${section}`,

  name: {
    section: "tu nombre",
    label: "¿Cómo te gustaría que te llamemos?",
    hint: "Así te saludaremos en Inicio",
  },

  day: {
    title: "Tu día",
    subtitle: "Cuándo empieza y termina tu jornada entre semana",
    startLabel: "Inicio del día",
    endLabel: "Fin del día",
    length: (duration: string) => `${duration} disponibles`,
    workOutsideDay: "Tu horario laboral debe quedar dentro de tu día",
    nextDay: "Del día siguiente",
  },

  work: {
    title: "Horario laboral / escolar",
    subtitle: "La IA no agendará tareas en este bloque",
    toggleLabel: "Tengo un horario laboral o escolar",
    toggleDescription: "Se aplica de lunes a viernes",
    daysLabel: "Días en los que se aplica",
    windowLabel: "Bloque reservado",
    reserved: (duration: string) => `${duration} reservadas`,
    startLabel: "Entrada",
    endLabel: "Salida",
    empty: "Sin horario laboral. La IA puede usar todo tu día.",
  },


  savedToast: "Cambios guardados",
} as const;
