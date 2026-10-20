"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  variant?: "default" | "focus";
  pinned?: boolean;
}

export function ProjectGallery({ images, title, variant = "default", pinned = false }: ProjectGalleryProps) {
  const focused = variant === "focus";
  const fixed = focused && pinned;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex];

  const move = useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      // Capture before the XMB's global keyboard listener, so Escape closes
      // only the lightbox rather than also leaving the project focus view.
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setLightboxOpen(false);
      } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        // No keyboard navigation should leak through to the XMB behind the dialog.
        event.preventDefault();
        event.stopPropagation();
        if (images.length > 1 && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      } else if (event.key === "Tab") {
        const buttons = Array.from(lightboxRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled]):not([tabindex=\"-1\"])") ?? []);
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!lightboxRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          closeButtonRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [lightboxOpen, images.length, move]);

  if (!activeImage) return null;

  return (
    <section className={focused ? "w-full min-w-0" : "mt-10"} aria-label={`${title} gallery`}>
      {focused && (
        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/40">
          <span>Gallery</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}

      <div className={focused
        ? "flex min-w-0 items-center justify-center"
        : "relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 shadow-2xl"
      }>
        {/* The focus gallery follows each image's own aspect ratio: no fixed
            4:3 canvas, padding, or filled background around smaller images. */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Enlarge image ${activeIndex + 1} of ${images.length}`}
          title="Enlarge image"
          className={focused
            ? "block max-w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]"
            : "block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]"
          }
        >
          {/* Atlas media URLs can vary by deployment, so keep this host-agnostic. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeImage}
            src={activeImage}
            alt={`${title} project view ${activeIndex + 1}`}
            className={focused
              ? "block h-auto w-auto max-h-[min(55dvh,34rem)] max-w-full object-contain"
              : "aspect-video w-full object-contain"
            }
          />
        </button>

        {!focused && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-xl text-white/80 backdrop-blur-md transition hover:border-white/35 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
            >←</button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-xl text-white/80 backdrop-blur-md transition hover:border-white/35 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
            >→</button>
          </>
        )}
        {!focused && (
          <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/65 backdrop-blur-md">
            {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        )}
      </div>

      {focused && images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-5" role="group" aria-label="Gallery navigation">
          <button type="button" onClick={() => move(-1)} aria-label="Previous image" className="px-2 py-1 text-xl text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--psp-accent)]">←</button>
          {fixed ? (
            <div className="flex items-center gap-2" role="group" aria-label="Choose gallery image">
              {images.map((src, index) => (
                <button
                  type="button"
                  key={src + index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  className={`h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)] ${index === activeIndex ? "bg-[var(--psp-accent)]" : "bg-white/25 hover:bg-white/55"}`}
                />
              ))}
            </div>
          ) : (
            <span className="font-mono text-xs tracking-widest text-white/40">
              {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          )}
          <button type="button" onClick={() => move(1)} aria-label="Next image" className="px-2 py-1 text-xl text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--psp-accent)]">→</button>
        </div>
      )}

      {images.length > 1 && !focused && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Choose gallery image">
          {images.map((src, index) => (
            <button
              type="button"
              role="listitem"
              key={src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`shrink-0 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${index === activeIndex ? "border-[var(--psp-accent)] opacity-100" : "border-white/10 opacity-45 hover:opacity-75"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-video w-28 object-cover sm:w-36" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && typeof document !== "undefined" && createPortal(
        <div ref={lightboxRef} role="dialog" aria-modal="true" aria-label={`${title} enlarged image`} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-5 py-14 text-white">
          <button type="button" tabIndex={-1} onClick={() => setLightboxOpen(false)} aria-label="Close enlarged image" className="absolute inset-0 cursor-zoom-out" />
          <div className="pointer-events-none relative z-10 flex max-h-full w-full flex-col items-center justify-center gap-5">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image viewer"
              className="pointer-events-auto absolute right-0 -top-10 px-2 py-1 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >Close ×</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={`${title} project view ${activeIndex + 1}`}
              className="pointer-events-auto block h-auto w-auto max-h-[calc(100dvh-10rem)] max-w-[min(92vw,90rem)] object-contain"
            />
            {images.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-8 text-sm text-white/75">
                <button type="button" onClick={() => move(-1)} aria-label="Previous enlarged image" className="px-3 py-1 text-xl hover:text-white focus-visible:outline-2 focus-visible:outline-white">←</button>
                <span className="font-mono text-xs tracking-[0.2em] text-white/55">{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => move(1)} aria-label="Next enlarged image" className="px-3 py-1 text-xl hover:text-white focus-visible:outline-2 focus-visible:outline-white">→</button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
