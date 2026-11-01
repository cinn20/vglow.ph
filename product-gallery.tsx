"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string | null;
}) {
  const gallery = images.length ? images : ["/images/products/serum.jpg"];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const go = (direction: number) => {
    setActive((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="relative flex-1">
        <div
          className="group relative aspect-[4/5] w-full overflow-hidden bg-cream"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
          <Image
            key={gallery[active]}
            src={gallery[active]}
            alt={`${name} — image ${active + 1}`}
            fill
            priority={active === 0}
            sizes="(min-width: 1024px) 620px, 100vw"
            className={`object-cover transition duration-[900ms] ease-out ${
              zoom ? "scale-[1.08]" : "scale-100"
            }`}
          />
          {badge && (
            <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-espresso backdrop-blur">
              {badge}
            </span>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-ivory/80 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.16em] text-espresso backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-gold" />
            {active + 1} / {gallery.length}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="flex h-9 w-9 items-center justify-center bg-ivory/90 text-espresso backdrop-blur transition hover:bg-ivory"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="flex h-9 w-9 items-center justify-center bg-ivory/90 text-espresso backdrop-blur transition hover:bg-ivory"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2.5 overflow-x-auto lg:w-[86px] lg:flex-col lg:overflow-visible">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === active}
            className={`relative aspect-[4/5] w-[68px] shrink-0 overflow-hidden border transition lg:w-full ${
              index === active ? "border-gold" : "border-transparent opacity-65 hover:opacity-100"
            }`}
          >
            <Image src={image} alt="" fill sizes="86px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
