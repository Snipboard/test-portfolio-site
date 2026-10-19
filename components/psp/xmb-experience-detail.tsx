import type { XmbItem } from "./types";

export function XmbExperienceDetail({ item, compact = false }: { item: XmbItem; compact?: boolean }) {
  return <div className={compact ? "border-l border-[var(--psp-accent)] pl-5 sm:pl-7" : ""}>
    <p className="text-xs text-[var(--psp-accent)]">Professional experience</p>
    <h2 className={`${compact ? "mt-3 text-3xl" : "mt-2 text-2xl"} font-semibold tracking-tight`}>{item.title}</h2>
    {item.subtitle && <p className={compact ? "mt-3 text-[19px] text-white/80" : "mt-2 text-[15px] text-white/80"}>{item.subtitle}</p>}
    {item.period && <p className="mt-2 text-sm text-white/50">{item.period}</p>}
    {item.description && <p className={compact ? "mt-7 max-w-lg text-[17px] leading-7 text-white/70" : "mt-4 max-w-lg text-[15px] leading-6 text-white/70 line-clamp-4"}>{item.description}</p>}
    {!!item.highlights?.length && <ul className={compact ? "mt-6 space-y-3 text-[15px] leading-6 text-white/65" : "mt-4 space-y-2 text-[13px] leading-5 text-white/60"}>{item.highlights.slice(0, compact ? 3 : 2).map(x=><li key={x}>{x}</li>)}</ul>}
  </div>;
}
