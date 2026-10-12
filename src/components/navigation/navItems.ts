import { House, ListChecks, User, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: "/home" | "/checklist" | "/profile";
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/home", label: "Inicio", icon: House },
  { href: "/checklist", label: "Rutina", icon: ListChecks },
  { href: "/profile", label: "Perfil", icon: User },
];

export const APP_NAME = "Routine";
export const MAIN_NAV_LABEL = "Navegación principal";

export function isNavItemActive(pathname: string, href: NavItem["href"]): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
