"use client";

import type { XmbItem } from "./types";
import { MarkdownText } from "./markdown-text";
import { XmbExperienceDetail } from "./xmb-experience-detail";
import { XmbBlogDetail } from "./xmb-blog-detail";
import { XmbProjectDetail } from "./xmb-project-detail";

interface XmbDetailPanelProps {
  activeItem?: XmbItem;
  onActivate?: () => void;
}

export function XmbDetailPanel({
  activeItem,
  onActivate,
}: XmbDetailPanelProps) {
  return (
    <div className="absolute bottom-[11%] left-[50%] right-[10%] top-[47%] z-20 overflow-y-auto border-l border-white/15 pl-7">
        {activeItem && (
          <div
            className="flex max-w-lg flex-col gap-3"
            style={{ fontFamily: activeItem.fontFamily }}
          >
            {activeItem.kind === "experience" ? (
              <XmbExperienceDetail item={activeItem} />
            ) : activeItem.kind === "project" ? (
              <XmbProjectDetail item={activeItem} onOpen={onActivate} />
            ) : activeItem.kind === "post" ? (
              <XmbBlogDetail item={activeItem} onRead={onActivate} />
            ) : <>
            <div className="flex flex-col gap-1">
              {activeItem.eyebrow && (
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--psp-accent)]">
                  {activeItem.eyebrow}
                </p>
              )}
              <h2 className="text-2xl font-semibold tracking-tight text-white drop-shadow-md">
                {activeItem.title}
              </h2>
              {activeItem.subtitle && (
                <p className="text-sm text-white/70 font-medium">{activeItem.subtitle}</p>
              )}
            </div>

            <div className="h-px bg-white/20 w-3/4 my-0" />

            {activeItem.description && (
              <MarkdownText variant="preview">{activeItem.description}</MarkdownText>
            )}

            {activeItem.activationLabel && activeItem.href && activeItem.downloadName ? (
              <a
                href={activeItem.href}
                download={activeItem.downloadName}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: activeItem.fontFamily }}
                className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white hover:border-[var(--psp-accent)] hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
              >
                <span aria-hidden="true">↓</span>
                <span>{activeItem.activationLabel}</span>
              </a>
            ) : activeItem.activationLabel && onActivate && (
              <button
                type="button"
                onClick={onActivate}
                disabled={activeItem.activationLabel === "Active"}
                style={{ fontFamily: activeItem.fontFamily }}
                className="flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white hover:border-[var(--psp-accent)] hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] disabled:cursor-default disabled:opacity-50"
              >
                <span>{activeItem.activationLabel}</span>
              </button>
            )}

            {activeItem.customContent}

            {activeItem.highlights && activeItem.highlights.length > 0 && (
              <ul className="grid gap-2 text-xs leading-5 text-white/60" aria-label="Highlights">
                {activeItem.highlights.slice(0, 2).map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeItem.tags && activeItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeItem.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-[11px] font-medium rounded bg-white/10 text-white/70 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            </>}
          </div>
        )}
    </div>
  );
}
