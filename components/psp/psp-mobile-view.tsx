"use client";

import { Fragment } from "react";
import type { XmbCategory } from "./types";
import type { PortfolioContact } from "@/lib/portfolio-types";
import { XmbContactLinks } from "./xmb-header";
import { MarkdownText } from "./markdown-text";
import { HorizontalScrollFade } from "./horizontal-scroll-fade";
import { XmbExperienceDetail } from "./xmb-experience-detail";
import { XmbBlogDetail } from "./xmb-blog-detail";
import { XmbProjectDetail } from "./xmb-project-detail";
import { XmbItemIcon } from "./xmb-item-icon";

interface PspMobileViewProps {
  categories: XmbCategory[];
  contact: PortfolioContact;
  name?: string;
  activeCategoryIndex: number;
  activeItemIndex: number;
  onCategorySelect: (index: number) => void;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
}

export function PspMobileView({
  categories,
  contact,
  name = "Affan Khan",
  activeCategoryIndex,
  activeItemIndex,
  onCategorySelect,
  onItemSelect,
  onItemActivate,
}: PspMobileViewProps) {
  const category = categories[activeCategoryIndex] ?? categories[0];
  const item = category?.items[activeItemIndex] ?? category?.items[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--psp-bg)] px-5 pb-12 pt-6 text-[var(--psp-fg)]">
      <header className="relative z-10 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <div className="-ml-1.5 mt-1 w-fit">
            <XmbContactLinks contact={contact} />
          </div>
        </div>
      </header>

      <nav className="relative z-10 -mx-5 mt-6" aria-label="Portfolio sections">
        <HorizontalScrollFade
          viewportClassName="scroll-px-5"
          contentClassName="flex gap-3 px-5 pb-3"
          resetKey="portfolio-sections"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const active = index === activeCategoryIndex;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onCategorySelect(index)}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-[78px] shrink-0 snap-start flex-col items-center gap-1.5 border-b-2 px-2 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                  active
                    ? "border-[var(--psp-accent)] text-white"
                    : "border-transparent text-white/50"
                }`}
              >
                <Icon className="h-7 w-7" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </HorizontalScrollFade>
      </nav>

      <main className="relative z-10 mt-7">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">{category.label}</p>
            <div className="mt-3 border-t border-white/10" role="group" aria-label={`${category.label} items`}>
              {category.items.map((categoryItem, index) => {
                const active = index === activeItemIndex;
                const startsGroup = categoryItem.groupTitle &&
                  (index === 0 || category.items[index - 1]?.groupId !== categoryItem.groupId);
                return (
                  <Fragment key={categoryItem.id}>
                    {startsGroup && (
                      <h3 className="border-b border-white/10 px-3 pb-2 pt-5 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                        {categoryItem.groupTitle}
                      </h3>
                    )}
                    <button
                      type="button"
                      onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center gap-3 border-b border-white/10 pr-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${categoryItem.groupTitle ? "pl-8 py-3" : "pl-3 py-2"} ${
                        active
                          ? "bg-white/5 text-white"
                          : "text-white/55"
                      }`}
                    >
                      <XmbItemIcon item={categoryItem} active={active} />
                      <span style={{ fontFamily: categoryItem.fontFamily }}>{categoryItem.title}</span>
                    </button>
                  </Fragment>
                );
              })}
            </div>

        {item && (
          <section className="mt-5 border-l border-white/15 pl-5" aria-live="polite" style={{ fontFamily: item.fontFamily }}>
            {item.kind === "experience" ? (
              <XmbExperienceDetail item={item} compact />
            ) : item.kind === "project" ? (
              <XmbProjectDetail item={item} compact onOpen={item.activationLabel ? () => onItemActivate(activeItemIndex) : undefined} />
            ) : item.kind === "post" ? (
              <XmbBlogDetail item={item} compact onRead={item.activationLabel ? () => onItemActivate(activeItemIndex) : undefined} />
            ) : <>
            {item.eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--psp-accent)]">{item.eyebrow}</p>
            )}
            <h2 className="mt-1 text-3xl font-bold tracking-tight">{item.title}</h2>
            {item.subtitle && <p className="mt-2 text-sm text-white/60">{item.subtitle}</p>}
            <div className="my-5 h-px bg-white/12" />
            {item.description && <MarkdownText>{item.description}</MarkdownText>}

            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-white/60">
                {item.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="text-[var(--psp-accent)]" aria-hidden="true">◆</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            {item.tags && item.tags.length > 0 && (
              <HorizontalScrollFade
                className="-mx-6 mt-5"
                viewportClassName="scroll-px-6"
                contentClassName="flex gap-2 px-6 pb-1"
                role="list"
                ariaLabel={`${item.title} technologies`}
                resetKey={item.id}
              >
                {item.tags.map((tag) => (
                  <span role="listitem" key={tag} className="shrink-0 snap-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">{tag}</span>
                ))}
              </HorizontalScrollFade>
            )}

            {item.activationLabel && item.href && item.downloadName ? (
              <a
                href={item.href}
                download={item.downloadName}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: item.fontFamily }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--psp-accent)] px-4 py-3 text-sm font-bold text-black"
              >
                <span aria-hidden="true">↓</span>
                <span>{item.activationLabel}</span>
              </a>
            ) : item.activationLabel && (
              <button
                type="button"
                onClick={() => onItemActivate(activeItemIndex)}
                disabled={item.activationLabel === "Active"}
                style={{ fontFamily: item.fontFamily }}
                className="mt-6 w-full rounded-2xl bg-[var(--psp-accent)] px-4 py-3 text-sm font-bold text-black disabled:opacity-50"
              >
                {item.activationLabel}
              </button>
            )}
            </>}
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-12 border-t border-white/10 pt-5 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Tap a section, then choose an item
      </footer>
    </div>
  );
}
