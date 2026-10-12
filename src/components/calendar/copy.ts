export const calendarCopy = {
  previousWeek: "Semana anterior",
  nextWeek: "Semana siguiente",
  today: "Hoy",
  tomorrow: "Mañana",
  weekend: "Fin de sem.",

  // Monday-first, matches the day selector. `workday` = the work block applies.
  weekdays: [
    { short: "L", name: "Lunes", workday: true },
    { short: "M", name: "Martes", workday: true },
    { short: "X", name: "Miércoles", workday: true },
    { short: "J", name: "Jueves", workday: true },
    { short: "V", name: "Viernes", workday: true },
    { short: "S", name: "Sábado", workday: false },
    { short: "D", name: "Domingo", workday: false },
  ],
  workdayActive: "con horario",
  workdayInactive: "libre",
} as const;
