/**
 * In-memory (per tab session) store for the text typed on Home, so it survives
 * navigating to other tabs and cancelling a proposal. Intentionally not
 * persisted: it's scratch input, not user data.
 */
export type HomeInput = {
  /** Selected day, or null to use the default (tomorrow). */
  date: string | null;
  userTasks: string;
  events: string;
};

let homeInput: HomeInput = { date: null, userTasks: "", events: "" };

export function getHomeInput(): HomeInput {
  return homeInput;
}

export function setHomeInput(changes: Partial<HomeInput>): void {
  homeInput = { ...homeInput, ...changes };
}
