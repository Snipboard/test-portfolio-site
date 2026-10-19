"use client";

import { useState } from "react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  variant?: "default" | "focus";
}

export function ProjectGallery({ images, title, variant = "default" }: ProjectGalleryProps) {
  const focused = variant === "focus";
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <section className={focused ? "w-full min-w-0" : "mt-10"} aria-label={`${title} gallery`}>
      {focused && (
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/40">
          <span>Gallery</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}
      <div className={focused
        ? "relative overflow-hidden border border-white/10 bg-white/[0.025]"
        : "relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 shadow-2xl"
      }>
        {/* Atlas media URLs can vary by deployment, so keep this renderer host-agnostic. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeImage}
          src={activeImage}
          alt={`${title} project view ${activeIndex + 1}`}
          className={focused ? "aspect-[4/3] max-h-[min(55vh,34rem)] w-full object-contain p-3 sm:p-5" : "aspect-video w-full object-contain"}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-xl text-white/80 backdrop-blur-md transition hover:border-white/35 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-xl text-white/80 backdrop-blur-md transition hover:border-white/35 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
            >
              →
            </button>
          </>
        )}

        <div className={focused ? "sr-only" : "absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/65 backdrop-blur-md"}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Choose gallery image">
          {images.map((src, index) => (
            <button
              type="button"
              role="listitem"
              key={src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`shrink-0 overflow-hidden ${focused ? "rounded-sm" : "rounded-xl"} border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                index === activeIndex ? "border-[var(--psp-accent)] opacity-100" : "border-white/10 opacity-45 hover:opacity-75"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className={focused ? "aspect-video w-20 object-cover sm:w-24" : "aspect-video w-28 object-cover sm:w-36"} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
