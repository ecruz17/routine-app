import { homeCopy } from "./copy";

type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  return (
    <div className="flex flex-col gap-space-xs">
      <h1 className="font-display text-display-lg-mobile tracking-tight text-on-surface md:text-display-lg">
        {homeCopy.greeting(name)}
      </h1>
      <p className="text-body-lg text-on-surface-variant">{homeCopy.subtitle}</p>
    </div>
  );
}
