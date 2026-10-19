"use client";

import type { XmbItem } from "./types";
import { XmbItemIcon } from "./xmb-item-icon";

interface XmbVerticalAxisProps {
  items: XmbItem[];
  activeItemIndex: number;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
}

export function XmbVerticalAxis({
  items,
  activeItemIndex,
  onItemSelect,
  onItemActivate,
}: XmbVerticalAxisProps) {
  return (
    <nav className="psp-xmb-rail pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-label="Items in selected section">
      {items.map((item, index) => {
        const distance = index - activeItemIndex;
        const active = distance === 0;
        const offset = distance < 0 ? -44 + (distance + 1) * 58 : 126 + distance * 58;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
            aria-current={active ? "true" : undefined}
            className={`psp-xmb-item pointer-events-auto absolute left-[18%] flex w-[27%] items-center gap-4 rounded-sm py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
              active ? "font-semibold text-white" : "text-white/55 hover:text-white"
            }`}
            style={{ top: `calc(24% + ${offset}px)`, fontFamily: item.fontFamily }}
          >
            <XmbItemIcon item={item} active={active} />
            <span className={`min-w-0 truncate ${active ? "text-xl" : "text-base"}`}>{item.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
