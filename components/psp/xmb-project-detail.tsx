import type { XmbItem } from "./types";

export function XmbProjectDetail({ item, compact = false, onOpen }: { item: XmbItem; compact?: boolean; onOpen?: () => void }) {
  return <div className={compact ? "space-y-5" : "space-y-3"}>
    {item.date && <p className="text-sm text-[var(--psp-accent)]">{item.date}</p>}
    <h2 className={`${compact ? "text-3xl" : "text-2xl"} font-semibold leading-tight tracking-tight text-white`}>{item.title}</h2>
    {item.description && <p className={`${compact ? "text-[17px] leading-7" : "text-[15px] leading-6 line-clamp-4"} max-w-xl text-white/75`}>{item.description}</p>}
    {(item.eyebrow || item.note) && <p className="text-sm text-white/50">{[item.eyebrow,item.note].filter(Boolean).join(" · ")}</p>}
    {!!item.tags?.length && (
      <div className="flex flex-wrap gap-2" aria-label="Project technologies">
        {item.tags.map((tag) => (
          <span key={tag} className="border border-white/15 px-2.5 py-1 text-xs text-white/60">{tag}</span>
        ))}
      </div>
    )}
    {item.activationLabel && onOpen && <button type="button" onClick={onOpen} className="border-b border-[var(--psp-accent)] pb-1 text-sm font-medium text-white hover:text-[var(--psp-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]">More info →</button>}
  </div>;
}
