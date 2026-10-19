import type { XmbItem } from "./types";

export function XmbItemIcon({ active = false }: { item: XmbItem; active?: boolean }) {
  return (
    <span className="flex h-3 w-3 shrink-0 items-center" aria-hidden="true">
      <span
        className={`h-px rounded-full transition-all ${
          active ? "w-3 bg-white/75" : "w-2 bg-white/25"
        }`}
      />
    </span>
  );
}
