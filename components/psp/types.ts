import type { ComponentType } from "react";
import type { ShowcaseConfig } from "@/lib/showcase";
import type { PortfolioLink } from "@/lib/portfolio-types";

export interface XmbItem {
  id: string;
  kind?: "home" | "project" | "experience" | "post" | "contact" | "folder";
  title: string;
  // Optional non-selectable heading for a contiguous group of content entries.
  groupId?: string;
  groupTitle?: string;
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
  action?: "open-collection" | "collection-back";
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
