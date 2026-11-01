export default function ShopLoading() {
  return (
    <div>
      <div className="border-b border-ink/10 bg-cream">
        <div className="container-luxe py-12 md:py-16">
          <div className="h-3 w-40 animate-pulse bg-sand/70" />
          <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse bg-sand/70" />
          <div className="mt-4 h-3 w-full max-w-xl animate-pulse bg-sand/60" />
        </div>
      </div>
      <div className="container-luxe grid gap-10 py-12 lg:grid-cols-[240px_1fr] lg:gap-14">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-3 w-3/4 animate-pulse bg-sand/60" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[4/5] animate-pulse bg-sand/60" />
              <div className="mt-4 h-3 w-2/3 animate-pulse bg-sand/60" />
              <div className="mt-2 h-3 w-1/3 animate-pulse bg-sand/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
