"use client";

import type { PortfolioContact } from "@/lib/portfolio-types";
import type { XmbCategory, XmbItem } from "./types";
import { XmbContactLinks } from "./xmb-header";
import { MarkdownText } from "./markdown-text";

interface PspMobileViewProps {
  categories: XmbCategory[];
  contact: PortfolioContact;
  name?: string;
  onItemActivate: (item: XmbItem) => void;
}

/**
 * A reading-first mobile layout. There is one document scroll, and every
 * project/post opens on the first tap; no XMB selection or preview state.
 */
function MobileItemList({
  items,
  onItemActivate,
}: {
  items: XmbItem[];
  onItemActivate: (item: XmbItem) => void;
}) {
  const groups: { id: string; title?: string; entries: XmbItem[] }[] = [];

  for (const item of items) {
    const id = item.groupId ?? "ungrouped";
    const previous = groups[groups.length - 1];
    if (previous && previous.id === id) {
      previous.entries.push(item);
    } else {
      groups.push({ id, title: item.groupTitle, entries: [item] });
    }
  }

  return (
    <div className="mt-6">
      {groups.map((group, groupIndex) => (
        <div key={group.id + groupIndex} className={groupIndex > 0 ? "mt-8" : undefined}>
          {group.title && (
            <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-white/50">
              {group.title}
            </h3>
          )}
          <ul className="divide-y divide-white/10 border-t border-white/10">
            {group.entries.map((item) => {
              const canOpen = Boolean(item.detailHref || (item.href && item.href !== "#"));
              return (
                <li key={item.id}>
                  {canOpen ? (
                    <button
                      type="button"
                      onClick={() => onItemActivate(item)}
                      aria-label={"Open " + item.title}
                      aria-haspopup={item.detailHref ? "dialog" : undefined}
                      className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-base text-white/85 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
                    >
                      <span className="min-w-0" style={{ fontFamily: item.fontFamily }}>
                        {item.title}
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-white/40">→</span>
                    </button>
                  ) : (
                    <div className="flex min-h-14 items-center justify-between gap-4 py-3 text-base text-white/55">
                      <span>{item.title}</span>
                      <span className="text-xs text-white/40">Coming soon</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function PspMobileView({
  categories,
  contact,
  name = "Affan Khan",
  onItemActivate,
}: PspMobileViewProps) {
  const home = categories.find((category) => category.id === "home")?.items[0];
  const projects = categories.find((category) => category.id === "projects");
  const writing = categories.find((category) => category.id === "blog");

  return (
    <div className="min-h-screen bg-[var(--psp-bg)] px-6 pb-14 pt-5 text-white sm:px-9 sm:pt-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="min-w-0 text-lg font-semibold tracking-tight">{name}</h1>
            <div className="-mr-2 shrink-0 [&_a]:h-11 [&_a]:w-11">
              <XmbContactLinks contact={contact} />
            </div>
          </div>
          <nav aria-label="Portfolio sections" className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-1 text-sm">
            <a href="#home" className="inline-flex min-h-11 items-center text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]">Home</a>
            {projects && <a href="#projects" className="inline-flex min-h-11 items-center text-white/65 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]">Projects</a>}
            {writing && writing.items.length > 0 && <a href="#writing" className="inline-flex min-h-11 items-center text-white/65 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]">Writing</a>}
          </nav>
        </header>

        <main>
          <section id="home" aria-labelledby="mobile-about-title" className="scroll-mt-6 pt-12">
            <h2 id="mobile-about-title" className="text-xl font-semibold tracking-tight">About Me</h2>
            {home?.description && (
              <div className="mt-5" style={{ fontFamily: home.fontFamily }}>
                <MarkdownText variant="home">{home.description}</MarkdownText>
              </div>
            )}
            {home?.href && home.activationLabel && (
              <a
                href={home.href}
                download={home.downloadName || true}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-white/30 text-sm font-medium text-white/85 hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
              >
                {home.activationLabel}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </section>

          {projects && projects.items.length > 0 && (
            <section id="projects" aria-labelledby="mobile-projects-title" className="scroll-mt-6 pt-20">
              <h2 id="mobile-projects-title" className="text-xl font-semibold tracking-tight">Projects</h2>
              <MobileItemList items={projects.items} onItemActivate={onItemActivate} />
            </section>
          )}

          {writing && writing.items.length > 0 && (
            <section id="writing" aria-labelledby="mobile-writing-title" className="scroll-mt-6 pt-20">
              <h2 id="mobile-writing-title" className="text-xl font-semibold tracking-tight">Writing</h2>
              <MobileItemList items={writing.items} onItemActivate={onItemActivate} />
            </section>
          )}
        </main>

        <footer className="mt-20 flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-white/45">
          <span>{name}</span>
          <a href="#home" className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]">
            Back to top ↑
          </a>
        </footer>
      </div>
    </div>
  );
}
