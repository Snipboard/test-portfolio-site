import type { XmbItem } from "./types";

export function XmbExperienceDetail({ item, compact = false }: { item: XmbItem; compact?: boolean }) {
  return <div className="border-l border-[var(--psp-accent)] pl-5 sm:pl-7">
    <p className="text-sm text-[var(--psp-accent)]">Professional experience</p>
    <h2 className={`${compact ? "mt-3 text-3xl" : "mt-3 text-4xl"} font-semibold tracking-tight`}>{item.title}</h2>
    {item.subtitle && <p className="mt-3 text-lg text-white/80">{item.subtitle}</p>}
    {item.period && <p className="mt-2 text-sm text-white/50">{item.period}</p>}
    {item.description && <p className="mt-7 max-w-lg text-base leading-7 text-white/70">{item.description}</p>}
    {!!item.highlights?.length && <ul className="mt-6 space-y-3 text-sm leading-6 text-white/65">{item.highlights.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul>}
  </div>;
}
