"use client";

import type { XmbCategory } from "./types";

interface XmbHorizontalAxisProps {
  categories: XmbCategory[];
  activeCategoryIndex: number;
  onCategorySelect: (index: number) => void;
  locked?: boolean;
}

export function XmbHorizontalAxis({
  categories,
  activeCategoryIndex,
  onCategorySelect,
  locked = false,
}: XmbHorizontalAxisProps) {
  return (
    <nav className="pointer-events-none absolute inset-x-0 top-[var(--psp-axis-top)] z-20 h-28 overflow-hidden" aria-label="Portfolio sections">
      {categories.map((category, index) => {
        const active = index === activeCategoryIndex;
        const Icon = category.icon;
        return (
          <button
            type="button"
            key={category.id}
            onClick={() => onCategorySelect(index)}
            disabled={locked}
            aria-label={`Open ${category.label}`}
            aria-current={active ? "page" : undefined}
            className={`psp-xmb-category pointer-events-auto absolute top-0 flex w-[88px] cursor-pointer flex-col items-center gap-2 rounded-sm py-1 text-center disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
              active ? "text-white" : "text-white/45 hover:text-white/75"
            }`}
            style={{ left: `calc(var(--psp-navigation-left) + ${(index - activeCategoryIndex) * 108}px - 44px)` }}
          >
            <Icon className={active ? "h-14 w-14" : "h-12 w-12"} />
            <span className={`text-xs font-medium ${active ? "text-white/90" : "text-transparent"}`}>
              {category.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
