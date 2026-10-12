import { MainShell } from "@/components/navigation/MainShell";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return <MainShell>{children}</MainShell>;
}
