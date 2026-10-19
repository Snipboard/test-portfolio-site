import type { CSSProperties } from "react";
import { NEUTRAL_SHOWCASE, type ShowcaseConfig } from "../../lib/showcase.ts";

export function getPspThemeStyle(showcase?: ShowcaseConfig): CSSProperties {
  const background = showcase?.backgroundColor ?? NEUTRAL_SHOWCASE.backgroundColor;
  const accent = showcase?.accentColor ?? NEUTRAL_SHOWCASE.accentColor;
  const ambient = showcase?.ambientColor ?? NEUTRAL_SHOWCASE.ambientColor;
  return {
    ["--psp-bg" as string]: background,
    ["--psp-fg" as string]: "#f4f5f7",
    ["--psp-muted" as string]: "#9a9da5",
    ["--psp-accent" as string]: accent,
    ["--psp-ambient-color" as string]: ambient,
    ["--psp-secondary-accent" as string]: showcase?.secondaryAccentColor ?? NEUTRAL_SHOWCASE.secondaryAccentColor,
    ["--psp-wave-a" as string]: "color-mix(in srgb, var(--psp-ambient-color) 16%, transparent)",
    ["--psp-wave-b" as string]: "color-mix(in srgb, var(--psp-secondary-accent) 5%, transparent)",
    ["--psp-panel" as string]: "#15171c",
    ["--psp-font-ui" as string]: "var(--font-dm-sans)",
  };
}
