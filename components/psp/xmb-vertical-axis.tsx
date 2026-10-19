"use client";

import type { XmbItem } from "./types";

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
    <nav className="absolute bottom-[12%] left-[8%] top-[36%] z-20 w-[29%] overflow-y-auto pr-5" aria-label="Items in selected section">
      {items.map((item, index) => {
        const active = index === activeItemIndex;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
            aria-current={active ? "true" : undefined}
            className={`block w-full border-b border-white/10 px-3 py-4 text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
              active ? "border-l-2 border-l-[var(--psp-accent)] bg-white/5 font-semibold text-white" : "border-l-2 border-l-transparent text-white/55 hover:bg-white/5 hover:text-white"
            }`}
            style={{ fontFamily: item.fontFamily }}
          >
            {item.title}
          </button>
        );
      })}
    </nav>
  );
}
