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
    <nav className="absolute left-[8%] right-[8%] top-[21%] z-20 border-b border-white/15" aria-label="Portfolio sections">
      <div className="flex items-center gap-8">
        {categories.map((category, index) => {
          const active = index === activeCategoryIndex;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onCategorySelect(index)}
              disabled={locked}
              aria-current={active ? "page" : undefined}
              className={`-mb-px border-b-2 pb-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${
                active ? "border-[var(--psp-accent)] text-white" : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
