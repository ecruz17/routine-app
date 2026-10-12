const block = "animate-pulse rounded-xl bg-surface-container";

export function ScreenSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-space-lg">
      <div className="flex flex-col gap-space-sm">
        <div className={`${block} h-10 w-56`} />
        <div className={`${block} h-5 w-64`} />
      </div>
      <div className="flex gap-space-sm overflow-hidden">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className={`${block} h-24 w-20 shrink-0 md:flex-1`} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className={`${block} h-96 lg:col-span-8`} />
        <div className={`${block} h-72 lg:col-span-4`} />
      </div>
    </div>
  );
}
