"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { XmbItem } from "./types";
import { MarkdownText } from "./markdown-text";
import { ProjectGallery } from "./project-gallery";

interface XmbDetailPanelProps {
  activeItem?: XmbItem;
  onActivate?: () => void;
  focusStage?: 0 | 1 | 2 | 3;
  onClose?: () => void;
}

export function XmbDetailPanel({
  activeItem,
  onActivate,
  focusStage = 0,
  onClose,
}: XmbDetailPanelProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasFocusedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const isProject = activeItem?.kind === "project";
  const isPost = activeItem?.kind === "post";
  const shifting = focusStage >= 1 && (isProject || isPost);
  const focused = focusStage >= 2 && (isProject || isPost);
  const revealed = focusStage === 3 && (isProject || isPost);
  const writingFocused = focused && isPost;
  // Scroll drives both divider halves directly, without duration or easing.
  const { scrollY } = useScroll({ container: scrollRef });
  // The date is only ~2rem below the divider at rest, so open almost fully
  // before it reaches the line rather than stretching the split over 180px.
  const dividerScale = useTransform(scrollY, [0, 14, 30], [1, 0.25, 0.06]);
  const animation = { duration: reducedMotion ? 0 : 0.14, ease: "easeOut" as const };

  useEffect(() => {
    if (focused && !wasFocusedRef.current) backRef.current?.focus({ preventScroll: true });
    if (focusStage === 0 && wasFocusedRef.current) openRef.current?.focus({ preventScroll: true });
    if (focused) wasFocusedRef.current = true;
    else if (focusStage === 0) wasFocusedRef.current = false;
  }, [focused, focusStage]);

  useEffect(() => {
    // The preview and full article share the scroll element. Start each reading
    // session at its beginning instead of inheriting the previous position.
    if (writingFocused && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [writingFocused, activeItem?.id]);

  useEffect(() => {
    // Project focus scrolls in the full-width viewport; the gallery remains sticky.
    if (focused && isProject && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [focused, isProject, activeItem?.id]);

  // Keep the exact same heading and description mounted in both modes.
  // Only the panel's geometry changes; the full body/gallery are added around it.
  const images = activeItem && isProject
    ? Array.from(new Set(
        [activeItem.showcase?.artworkUrl, activeItem.image, ...(activeItem.gallery ?? [])]
          .filter((src): src is string => Boolean(src))
      ))
    : [];
  const links = activeItem && isProject ? [
    ...(activeItem.links ?? []),
    ...(activeItem.href && activeItem.href !== "#" &&
      !activeItem.links?.some((link) => link.url === activeItem.href)
      ? [{ label: "Open project", url: activeItem.href }]
      : []),
  ] : [];

  return (
    <section
      className={`psp-xmb-details absolute z-20 ${shifting ? "psp-xmb-details--shifting" : ""} ${focused ? "psp-xmb-details--expanded" : ""} ${isPost ? "psp-xmb-details--writing" : ""} ${isProject ? "psp-xmb-details--project" : ""}`}
      aria-label={focused ? (isPost ? "Writing focus view" : "Project focus view") : "Selected item details"}
    >
      <div
        className={`psp-focus-toolbar ${focused ? "psp-focus-toolbar--visible" : ""}`}
        aria-hidden={!focused}
        inert={!focused}
      >
        <span>{isPost ? "Writing" : "Projects"}</span>
        <button
          ref={backRef}
          type="button"
          onClick={onClose}
          className="rounded-sm px-2 py-1.5 text-sm normal-case tracking-normal text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
        >
          ← Back <span className="ml-2 text-xs text-white/30">Esc</span>
        </button>
        {writingFocused && (
          <div className="psp-writing-divider" aria-hidden="true">
            <motion.span
              className="psp-writing-divider__half psp-writing-divider__half--left"
              style={{ scaleX: reducedMotion ? 0 : dividerScale }}
            />
            <motion.span
              className="psp-writing-divider__half psp-writing-divider__half--right"
              style={{ scaleX: reducedMotion ? 0 : dividerScale }}
            />
          </div>
        )}
      </div>

      <div ref={scrollRef} className="psp-detail-scroll">
        {activeItem && (
          <div
            className={`psp-xmb-detail-layout ${focused ? "psp-xmb-detail-layout--expanded" : ""} ${isPost ? "psp-xmb-detail-layout--writing" : ""} ${isProject ? "psp-xmb-detail-layout--project" : ""} ${isProject && images.length ? "psp-xmb-detail-layout--with-gallery" : ""} ${focused && isProject && images.length ? "psp-xmb-detail-layout--gallery" : ""}`}
            style={{ fontFamily: activeItem.fontFamily }}
          >
            <article className="psp-xmb-detail-inner min-w-0">
              {isProject || isPost ? (
                <>
                  {activeItem.date && (
                    <p className="psp-detail-date text-sm text-[var(--psp-accent)]">{activeItem.date}</p>
                  )}
                  <h2 className="psp-detail-title font-semibold leading-tight tracking-tight text-white">
                    {activeItem.title}
                  </h2>
                  {activeItem.description && (
                    <p className="psp-detail-description text-white/75">{activeItem.description}</p>
                  )}
                  {isProject && (activeItem.eyebrow || activeItem.note) && (
                    <p className="psp-detail-note text-sm text-white/50">
                      {[activeItem.eyebrow, activeItem.note].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {!focused && isProject && !!activeItem.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Project technologies">
                      {activeItem.tags.map((tag) => (
                        <span key={tag} className="border border-white/15 px-2.5 py-1 text-xs text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {!focused && activeItem.detailHref && onActivate && (
                    <button
                      ref={openRef}
                      type="button"
                      onClick={onActivate}
                      className="psp-detail-open border-b border-[var(--psp-accent)] pb-1 text-sm font-medium text-white hover:text-[var(--psp-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]"
                    >
                      {isPost ? "Read" : "More info"} →
                    </button>
                  )}
                  <AnimatePresence initial={false}>
                    {revealed && (
                      <motion.div
                        key={`additional-${activeItem.id}`}
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0, transition: { duration: reducedMotion ? 0 : 0.08 } }}
                        transition={{ ...animation, delay: reducedMotion ? 0 : 0.07 }}
                        className="psp-detail-extra"
                      >
                        {isPost && activeItem.image && (
                          <figure className="my-7 border-y border-white/10 py-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={activeItem.image} alt={`${activeItem.title} illustration`} className="max-h-[30rem] w-full object-contain" />
                          </figure>
                        )}
                        {isPost && activeItem.tags && activeItem.tags.length > 0 && (
                          <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-xs text-white/45" aria-label="Writing topics">
                            {activeItem.tags.map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                        )}
                        {activeItem.body && (
                          <div className="mt-8 border-t border-white/15 pt-8">
                            <MarkdownText variant="focus">{activeItem.body}</MarkdownText>
                          </div>
                        )}
                        {isProject && activeItem.highlights && activeItem.highlights.length > 0 && (
                          <section className="mt-9 border-t border-white/15 pt-7" aria-label="Project highlights">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Highlights</h3>
                            <ul className="space-y-3">
                              {activeItem.highlights.map((highlight) => (
                                <li key={highlight} className="border-l border-[var(--psp-accent)] pl-4 text-[15px] leading-6 text-white/70">
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                        {isProject && activeItem.tags && activeItem.tags.length > 0 && (
                          <div className="mt-8 flex flex-wrap gap-2" aria-label="Tools and technologies">
                            {activeItem.tags.map((tag) => (
                              <span key={tag} className="border border-white/15 px-3 py-1.5 text-xs text-white/60">{tag}</span>
                            ))}
                          </div>
                        )}
                        {isProject && links.length > 0 && (
                          <nav className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-7" aria-label="Project links">
                            {links.map((link, index) => (
                              <a
                                key={link.url + "-" + index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-b border-[var(--psp-accent)] pb-1 text-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
                              >
                                {link.label} ↗
                              </a>
                            ))}
                          </nav>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  {activeItem.eyebrow && (
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--psp-accent)]">{activeItem.eyebrow}</p>
                  )}
                  <h2 className="text-2xl font-semibold tracking-tight text-white">{activeItem.title}</h2>
                  {activeItem.subtitle && <p className="text-[15px] font-medium text-white/70">{activeItem.subtitle}</p>}
                  <div className="my-3 h-px w-3/4 bg-white/20" />
                  {activeItem.description && <MarkdownText variant="preview">{activeItem.description}</MarkdownText>}
                  {activeItem.activationLabel && activeItem.href && activeItem.downloadName ? (
                    <a
                      href={activeItem.href}
                      download={activeItem.downloadName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
                    >
                      ↓ {activeItem.activationLabel}
                    </a>
                  ) : activeItem.activationLabel && onActivate && (
                    <button type="button" onClick={onActivate} className="mt-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                      {activeItem.activationLabel}
                    </button>
                  )}
                  {activeItem.customContent}
                  {activeItem.highlights && activeItem.highlights.length > 0 && (
                    <ul className="mt-4 grid gap-2 text-[13px] leading-5 text-white/60" aria-label="Highlights">
                      {activeItem.highlights.slice(0, 2).map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span className="text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeItem.tags && activeItem.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeItem.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-medium text-white/70">{tag}</span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </article>
            <AnimatePresence initial={false}>
              {revealed && isProject && images.length > 0 && (
                <motion.aside
                  key={`gallery-${activeItem.id}`}
                  className="psp-detail-gallery min-w-0"
                  aria-label="Project images"
                  initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.08 } }}
                  transition={{ ...animation, delay: reducedMotion ? 0 : 0.07 }}
                >
                  <ProjectGallery key={activeItem.id} images={images} title={activeItem.title} variant="focus" pinned />
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
