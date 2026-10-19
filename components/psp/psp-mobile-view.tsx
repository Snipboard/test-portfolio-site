"use client";

import type { XmbCategory } from "./types";
import { MarkdownText } from "./markdown-text";
import { HorizontalScrollFade } from "./horizontal-scroll-fade";
import { PspMobileSettings } from "./psp-mobile-settings";
import { PspMobileContact } from "./psp-mobile-contact";
import { XmbExperienceDetail } from "./xmb-experience-detail";
import { XmbBlogDetail } from "./xmb-blog-detail";
import { XmbProjectDetail } from "./xmb-project-detail";

interface PspMobileViewProps {
  categories: XmbCategory[];
  name?: string;
  tagline?: string;
  activeCategoryIndex: number;
  activeItemIndex: number;
  onCategorySelect: (index: number) => void;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
  navigationLocked?: boolean;
}

export function PspMobileView({
  categories,
  name = "Affan Khan",
  tagline = "Software Engineer",
  activeCategoryIndex,
  activeItemIndex,
  onCategorySelect,
  onItemSelect,
  onItemActivate,
  navigationLocked = false,
}: PspMobileViewProps) {
  const category = categories[activeCategoryIndex] ?? categories[0];
  const item = category?.items[activeItemIndex] ?? category?.items[0];

  const artwork = item?.showcase?.artworkUrl ?? item?.image ?? item?.gallery?.[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--psp-bg)] px-5 pb-12 pt-6 text-[var(--psp-fg)]">
      <div className="psp-ambient" aria-hidden="true">
        <div className="psp-wave psp-wave-a" />
        <div className="psp-wave psp-wave-b" />
      </div>

      <header className="relative z-10 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-white/55">{tagline}</p>
        </div>
      </header>

      <nav className="relative z-10 -mx-5 mt-6" aria-label="Portfolio sections">
        <HorizontalScrollFade
          disabled={navigationLocked}
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
                disabled={navigationLocked}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-[92px] snap-start flex-col items-center gap-2 border-b-2 px-3 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                  active
                    ? "border-[var(--psp-accent)] bg-white/10 text-white"
                    : "border-white/10 bg-black/15 text-white/40"
                }`}
              >
                <Icon className="h-7 w-7" />
                <span className="text-xs font-semibold tracking-wide">{cat.label}</span>
              </button>
            );
          })}
        </HorizontalScrollFade>
      </nav>

      <main className="relative z-10 mt-7">
        {artwork && (item?.kind === "project" || item?.kind === "experience") && (
          <figure className="mb-8 aspect-[16/10] w-full overflow-hidden border-b border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artwork} alt={`${item.title} showcase`} className="h-full w-full" style={{objectFit:item.showcase?.mediaFit ?? "contain",objectPosition:item.showcase?.mediaPosition ?? "center"}} />
          </figure>
        )}
        {category.id === "settings" ? (
          <PspMobileSettings category={category} onActivate={onItemActivate} />
        ) : category.id === "contact" ? (
          <PspMobileContact category={category} onActivate={onItemActivate} />
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">{category.label}</p>
            <HorizontalScrollFade
              className="mt-3"
              contentClassName="flex gap-2 pb-3"
              role="list"
              ariaLabel={`${category.label} items`}
              resetKey={category.id}
            >
              {category.items.map((categoryItem, index) => {
                const active = index === activeItemIndex;
                return (
                  <button
                    type="button"
                    role="listitem"
                    key={categoryItem.id}
                    onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
                    className={`inline-flex shrink-0 snap-start items-center gap-2 border-b px-2 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                      active
                        ? "border-white/50 bg-white text-black"
                        : "border-white/10 bg-white/5 text-white/55"
                    }`}
                  >
                    {categoryItem.action === "collection-back" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                        <path d="m10 17-5-5 5-5" /><path d="M5 12h14" />
                      </svg>
                    ) : categoryItem.kind === "folder" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                        <path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    ) : categoryItem.image && (
                      <span
                        aria-hidden="true"
                        className="h-6 w-7 bg-contain bg-center bg-no-repeat drop-shadow-sm"
                        style={{ backgroundImage: `url(${categoryItem.image})` }}
                      />
                    )}
                    <span style={{ fontFamily: categoryItem.fontFamily }}>{categoryItem.title}</span>
                  </button>
                );
              })}
            </HorizontalScrollFade>
          </>
        )}

        {item && category.id !== "settings" && category.id !== "contact" && (
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--psp-accent)] px-4 py-3 text-sm font-bold text-black transition active:scale-[0.99]"
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
                className="mt-6 w-full rounded-2xl bg-[var(--psp-accent)] px-4 py-3 text-sm font-bold text-black transition active:scale-[0.99] disabled:opacity-50"
              >
                {item.activationLabel}
              </button>
            )}
            </>}
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-12 border-t border-white/10 pt-5 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        {category.id === "contact"
          ? "Choose a channel to get in touch"
          : category.id === "settings"
            ? "Preferences are saved on this device"
            : "Tap a section, then choose an item"}
      </footer>
    </div>
  );
}
