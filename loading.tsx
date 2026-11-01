export default function ProductLoading() {
  return (
    <div className="container-luxe grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div>
        <div className="aspect-[4/5] animate-pulse bg-sand/60" />
        <div className="mt-3 flex gap-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] w-[68px] animate-pulse bg-sand/50 lg:w-[86px]" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-32 animate-pulse bg-sand/60" />
        <div className="h-10 w-4/5 animate-pulse bg-sand/70" />
        <div className="h-3 w-2/3 animate-pulse bg-sand/60" />
        <div className="h-16 w-full animate-pulse bg-sand/50" />
        <div className="h-8 w-40 animate-pulse bg-sand/60" />
        <div className="h-12 w-full animate-pulse bg-sand/60" />
        <div className="h-12 w-full animate-pulse bg-sand/50" />
      </div>
    </div>
  );
}
