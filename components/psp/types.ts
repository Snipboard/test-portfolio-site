import type { ComponentType } from "react";
import type { ShowcaseConfig } from "@/lib/showcase";
import type { PortfolioLink } from "@/lib/contentful";

export interface XmbItem {
  id: string;
  kind?: "home" | "project" | "experience" | "post" | "contact" | "setting" | "folder";
  title: string;
  eyebrow?: string;
  subtitle?: string;
  period?: string;
  date?: string;
  description?: string;
  image?: string;
  showcase?: ShowcaseConfig;
  fontFamily?: string;
  gallery?: string[];
  body?: string;
  highlights?: string[];
  tags?: string[];
  href?: string | null;
  downloadName?: string;
  links?: PortfolioLink[];
  detailHref?: string;
  action?: "motion" | "open-collection" | "collection-back";
  actionValue?: string;
  selected?: boolean;
  activationLabel?: string;
  note?: string;
  customContent?: React.ReactNode;
}

export interface XmbCategory {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  items: XmbItem[];
}

export interface XmbLayoutConfig {
  /** Crosshair X position as percentage of screen width (e.g. 0.24 = 24%) */
  crossX: number;
  /** Crosshair Y position as percentage of screen height (e.g. 0.28 = 28%) */
  crossY: number;
  /** Horizontal gap between category icons (px) */
  hGap: number;
  /** Vertical gap between sub-items (px) */
  vGap: number;
  /** Gap clearance ABOVE crosshair for items scrolling up */
  aboveClear: number;
  /** Gap clearance BELOW crosshair for active item & items below */
  belowClear: number;
  /** Active category icon size (px) */
  iconActiveSize: number;
  /** Inactive category icon size (px) */
  iconInactiveSize: number;
}
