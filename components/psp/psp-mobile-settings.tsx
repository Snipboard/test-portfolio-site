"use client";

import type { XmbCategory } from "./types";

export function PspMobileSettings({ category, onActivate }: { category: XmbCategory; onActivate: (index: number) => void }) {
  return (
    <section aria-labelledby="mobile-settings-title">
      <h2 id="mobile-settings-title" className="text-3xl font-semibold tracking-tight">Settings</h2>
      <p className="mt-2 text-sm text-white/55">Display preferences for this device.</p>
      {category.items.map((setting, index) => (
        <button key={setting.id} type="button" onClick={() => onActivate(index)} role="switch"
          aria-checked={Boolean(setting.selected)}
          className="mt-7 flex w-full items-center justify-between border-y border-white/15 py-5 text-left">
          <span><strong className="block font-medium">{setting.title}</strong><span className="mt-1 block text-sm text-white/50">{setting.description}</span></span>
          <span className="text-sm text-[var(--psp-accent)]">{setting.selected ? "On" : "Off"}</span>
        </button>
      ))}
    </section>
  );
}
