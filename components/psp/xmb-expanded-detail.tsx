"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { XmbItem } from "./types";
import { MarkdownText } from "./markdown-text";
import { ProjectGallery } from "./project-gallery";

interface XmbExpandedDetailProps {
  item: XmbItem;
  onClose: () => void;
  variant: "desktop" | "mobile";
  siteName?: string;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function XmbExpandedDetail({
  item,
  onClose,
  variant,
  siteName = "Affan Khan",
}: XmbExpandedDetailProps) {
  const isDesktop = variant === "desktop";
  const isPost = item.kind === "post";
  const titleId = isDesktop ? "xmb-focus-title-desktop" : "xmb-focus-title-mobile";
  const backRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  // Only focus the copy of the Back button that is visible at this breakpoint.
  useEffect(() => {
    const query = isDesktop ? "(min-width: 1024px)" : "(max-width: 1023px)";
    if (window.matchMedia(query).matches) backRef.current?.focus();
  }, [isDesktop]);

  // One gallery, with no duplicate hero image farther down the write-up.
  const images = Array.from(new Set(
    [item.showcase?.artworkUrl, item.image, ...(item.gallery ?? [])]
      .filter((src): src is string => Boolean(src))
  ));
  const links = [
    ...(item.links ?? []),
    ...(item.href && item.href !== "#" && !item.links?.some((link) => link.url === item.href)
      ? [{ label: "Open project", url: item.href }]
      : []),
  ];

  return (
    <motion.section
      role="region"
      aria-label={isPost ? "Writing focus view" : "Project focus view"}
      aria-labelledby={titleId}
      className={
        isDesktop
          ? "psp-focus-view absolute inset-x-0 bottom-0 z-[25] flex min-h-0 select-text flex-col overflow-hidden bg-[var(--psp-bg)] text-white"
          : "fixed inset-0 z-[80] flex min-h-0 select-text flex-col overflow-hidden bg-[var(--psp-bg)] text-white lg:hidden"
      }
      style={isDesktop ? { top: "var(--psp-focus-top)", fontFamily: item.fontFamily } : { fontFamily: item.fontFamily }}
      initial={reducedMotion ? { opacity: 0 } : isDesktop
        ? { clipPath: "inset(0 0 0 55%)", opacity: 1 }
        : { x: 36, opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : isDesktop
        ? { clipPath: "inset(0 0 0 0%)", opacity: 1 }
        : { x: 0, opacity: 1 }}
      exit={reducedMotion
        ? { opacity: 0, transition: { duration: 0.01 } }
        : isDesktop
          ? { opacity: 0, transition: { duration: 0.2, ease: easeOut } }
          : { x: 36, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.46, ease: easeOut }}
    >
      <div className={isDesktop
        ? "flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-[var(--psp-edge)] py-3"
        : "flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-5"
      }>
        <span className={isDesktop
          ? "text-xs uppercase tracking-[0.2em] text-white/40"
          : "text-lg font-semibold tracking-tight text-white"
        }>
          {isDesktop ? (isPost ? "Writing" : "Projects") : siteName}
        </span>
        <button
          ref={backRef}
          type="button"
          onClick={onClose}
          className="flex shrink-0 items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
        >
          <span aria-hidden="true">←</span> Back
          {isDesktop && <span className="ml-3 text-xs text-white/30">Esc</span>}
        </button>
      </div>

      <div className="psp-focus-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <motion.div
          className="mx-auto w-full max-w-[94rem] px-5 pb-20 pt-7 sm:px-9 lg:px-[var(--psp-edge)] lg:pb-24 lg:pt-10"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.12, ease: easeOut }}
        >
          {isPost ? (
            <article className="mx-auto max-w-[48rem]">
              {item.date && <time className="text-sm text-[var(--psp-accent)]">{item.date}</time>}
              <h1 id={titleId} className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {item.title}
              </h1>
              {item.description && (
                <p className="mt-6 max-w-[44rem] text-lg leading-8 text-white/65 sm:text-xl sm:leading-9">
                  {item.description}
                </p>
              )}
              {item.image && (
                <figure className="my-9 border-y border-white/10 py-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={`${item.title} illustration`} className="max-h-[30rem] w-full object-contain" />
                </figure>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-xs text-white/45" aria-label="Writing topics">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              )}
              {item.body && (
                <div className="mt-9 border-t border-white/15 pt-9">
                  <MarkdownText variant="body">{item.body}</MarkdownText>
                </div>
              )}
            </article>
          ) : (
            <div className={images.length > 0
              ? "grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16"
              : "max-w-[53rem]"
            }>
              <article className="min-w-0">
                {item.date && <p className="text-sm text-[var(--psp-accent)]">{item.date}</p>}
                <h1 id={titleId} className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">
                  {item.title}
                </h1>
                {(item.eyebrow || item.note) && (
                  <p className="mt-5 text-sm text-white/45">{[item.eyebrow, item.note].filter(Boolean).join(" · ")}</p>
                )}
                {item.description && (
                  <div className="mt-6">
                    <MarkdownText variant="lead">{item.description}</MarkdownText>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="mt-9 lg:hidden">
                    <ProjectGallery key={item.id} images={images} title={item.title} variant="focus" />
                  </div>
                )}

                {item.body && (
                  <section className="mt-10 border-t border-white/15 pt-9" aria-label="Project details">
                    <MarkdownText variant="body">{item.body}</MarkdownText>
                  </section>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <section className="mt-10 border-t border-white/15 pt-8" aria-label="Project highlights">
                    <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Highlights</h2>
                    <ul className="space-y-3">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="border-l border-[var(--psp-accent)] pl-4 text-sm leading-6 text-white/70">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-9 flex flex-wrap gap-2" aria-label="Tools and technologies">
                    {item.tags.map((tag) => (
                      <span key={tag} className="border border-white/15 px-3 py-1.5 text-xs text-white/60">{tag}</span>
                    ))}
                  </div>
                )}

                {links.length > 0 && (
                  <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-7" aria-label="Project links">
                    {links.map((link, index) => (
                      <a
                        key={link.url + "-" + index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-[var(--psp-accent)] pb-1 text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </nav>
                )}
              </article>

              {images.length > 0 && (
                <aside className="hidden min-w-0 lg:sticky lg:top-2 lg:block" aria-label="Project images">
                  <ProjectGallery key={item.id} images={images} title={item.title} variant="focus" />
                </aside>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
