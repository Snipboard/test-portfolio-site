import type { XmbItem } from "./types";

export function XmbBlogDetail({ item, compact = false, onRead }: { item: XmbItem; compact?: boolean; onRead?: () => void }) {
  return <div className="max-w-xl">
    {item.date && <p className="text-sm text-white/50">{item.date}</p>}
    <h2 className={`${compact ? "mt-3 text-3xl" : "mt-2 text-2xl"} font-medium leading-tight tracking-tight text-white`}>{item.title}</h2>
    {item.description && <p className={compact ? "mt-5 text-lg leading-8 text-white/65" : "mt-3 text-sm leading-6 text-white/65 line-clamp-4"}>{item.description}</p>}
    {item.activationLabel && onRead && <button type="button" onClick={onRead} className="mt-5 border-b border-white/60 pb-1 text-sm text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Read article →</button>}
  </div>;
}
