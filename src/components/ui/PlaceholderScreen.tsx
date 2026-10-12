import { Construction } from "lucide-react";
import { Card } from "./Card";

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <Card className="flex flex-col items-center gap-space-sm py-space-xl text-center">
      <Construction aria-hidden className="size-8 text-primary" />
      <h1 className="font-display text-headline-md text-on-surface">{title}</h1>
      <p className="text-body-md text-on-surface-variant">Próximamente</p>
    </Card>
  );
}
