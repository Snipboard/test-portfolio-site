/** Public presentation intent. Atlas chooses values; the UI only renders supported presets. */
export const SHOWCASE_LAYOUTS = ["media-led", "editorial", "immersive", "minimal"] as const;
export const SHOWCASE_MOTIFS = ["none", "grid", "lines", "geometric"] as const;
export const SHOWCASE_MOTION = ["none", "subtle", "ambient"] as const;
export const SHOWCASE_FITS = ["contain", "cover"] as const;
export const SHOWCASE_POSITIONS = ["center", "top", "bottom", "left", "right"] as const;

export type ShowcaseConfig = {
  accentColor?: string;
  secondaryAccentColor?: string;
  backgroundColor?: string;
  ambientColor?: string;
  artworkUrl?: string;
  backgroundUrl?: string;
  layout?: (typeof SHOWCASE_LAYOUTS)[number];
  motif?: (typeof SHOWCASE_MOTIFS)[number];
  motionStyle?: (typeof SHOWCASE_MOTION)[number];
  mediaFit?: (typeof SHOWCASE_FITS)[number];
  mediaPosition?: (typeof SHOWCASE_POSITIONS)[number];
};

export const NEUTRAL_SHOWCASE = {
  backgroundColor: "#0c0d10",
  accentColor: "#b9c0c9",
  ambientColor: "#313741",
  secondaryAccentColor: "#8b949e",
  layout: "minimal",
  motif: "none",
  motionStyle: "none",
  mediaFit: "contain",
  mediaPosition: "center",
} as const satisfies ShowcaseConfig;

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const color = (value: unknown): string | undefined =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : undefined;
const choice = <T extends string>(value: unknown, choices: readonly T[]): T | undefined =>
  typeof value === "string" && choices.includes(value as T) ? value as T : undefined;
export const safeMediaUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.length > 2048) return undefined;
  if (value.startsWith("/") && !value.startsWith("//") && !/[\\\s"'(){}<>]/.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)) ? url.href : undefined;
  } catch { return undefined; }
};

export function parseShowcase(value: unknown): ShowcaseConfig | undefined {
  if (!record(value)) return undefined;
  const parsed: ShowcaseConfig = {
    accentColor: color(value.accentColor),
    secondaryAccentColor: color(value.secondaryAccentColor),
    backgroundColor: color(value.backgroundColor),
    ambientColor: color(value.ambientColor),
    artworkUrl: safeMediaUrl(value.artworkUrl),
    backgroundUrl: safeMediaUrl(value.backgroundUrl),
    layout: choice(value.layout, SHOWCASE_LAYOUTS),
    motif: choice(value.motif, SHOWCASE_MOTIFS),
    motionStyle: choice(value.motionStyle, SHOWCASE_MOTION),
    mediaFit: choice(value.mediaFit, SHOWCASE_FITS),
    mediaPosition: choice(value.mediaPosition, SHOWCASE_POSITIONS),
  };
  return Object.values(parsed).some(Boolean) ? Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== undefined)) : undefined;
}
