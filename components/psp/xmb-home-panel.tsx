"use client";

import type { XmbItem } from "./types";
import { MarkdownText } from "./markdown-text";

interface XmbHomePanelProps {
  item: XmbItem;
  siteName: string;
}

/** Home is a landing panel, not a one-entry XMB submenu. */
export function XmbHomePanel({ item, siteName }: XmbHomePanelProps) {
  return (
    <section className="psp-home-panel absolute z-20" aria-label="About me">
      <div className={`psp-home-layout ${item.image ? "psp-home-layout--portrait" : ""}`}>
        <article className="psp-home-copy min-w-0" style={{ fontFamily: item.fontFamily }}>
          <h2 className="mb-5 text-2xl font-semibold leading-[1.3] tracking-tight text-white">
            About Me
          </h2>
          {item.description && <MarkdownText variant="home">{item.description}</MarkdownText>}
          {item.activationLabel && item.href && (
            <a
              href={item.href}
              download={item.downloadName || true}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 border-b border-white/35 pb-1 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
            >
              {item.activationLabel}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </article>
        {item.image && (
          <figure className="psp-home-photo" aria-label="Profile portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={`Portrait of ${siteName}`} />
          </figure>
        )}
      </div>
    </section>
  );
}
