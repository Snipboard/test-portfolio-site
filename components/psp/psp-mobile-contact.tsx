"use client";

import type { XmbCategory, XmbItem } from "./types";

interface PspMobileContactProps {
  category: XmbCategory;
  onActivate: (index: number) => void;
}

function ContactGlyph({ item }: { item: XmbItem }) {
  const common = "h-6 w-6";

  if (item.title.toLowerCase() === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (item.title.toLowerCase() === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M8.5 18.5c.4-1.5.2-2.7-.8-3.6-2.1.2-2.7-1-2.7-1 .7-.5 1.5-.5 2.2-.1 1.2.7 2.3.4 3 .1M15.5 18.5c-.5-2 .2-3.1.8-3.7 1.1-1 1.7-2.3 1.7-4a4.7 4.7 0 0 0-1.2-3.2c.1-.8 0-1.5-.4-2.1-1.2 0-2 .5-2.5 1a8 8 0 0 0-3.8 0c-.6-.6-1.4-1-2.5-1-.4.7-.5 1.4-.4 2.1A4.7 4.7 0 0 0 6 10.8c0 2.6 1.5 4.2 4.2 4.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 10v6M8 8v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" />
    </svg>
  );
}

export function PspMobileContact({ category, onActivate }: PspMobileContactProps) {
  return (
    <section aria-labelledby="mobile-contact-title">
      <h2 id="mobile-contact-title" className="text-3xl font-bold tracking-tight text-white">Get in touch</h2>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3">
        {category.items.map((contact, index) => (
          <button
            type="button"
            key={contact.id}
            onClick={() => onActivate(index)}
            className="group flex min-w-0 max-w-full items-center gap-4 overflow-hidden border-b border-white/15 py-4 text-left transition active:bg-white/5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center text-[var(--psp-accent)]">
              <ContactGlyph item={contact} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{contact.title}</span>
              {contact.subtitle && <span className="mt-0.5 block truncate text-sm text-white/55">{contact.subtitle}</span>}
              {contact.description && <span className="mt-1 block text-xs leading-5 text-white/35">{contact.description}</span>}
            </span>

            <span className="shrink-0 text-xl text-white/30 transition group-active:translate-x-0.5 group-active:text-[var(--psp-accent)]" aria-hidden="true">
              {contact.href?.startsWith("mailto:") ? "→" : "↗"}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-7 text-center text-xs leading-5 text-white/30">External profiles open in a new tab.</p>
    </section>
  );
}
