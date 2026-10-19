import type { XmbItem } from "./types";
import { BlogIcon, ContactIcon, ExperienceIcon, HomeIcon, ProjectsIcon } from "./xmb-icons";

export function XmbItemIcon({ item, active = false }: { item: XmbItem; active?: boolean }) {
  const Icon = item.kind === "project" || item.kind === "folder" ? ProjectsIcon
    : item.kind === "experience" ? ExperienceIcon
      : item.kind === "post" ? BlogIcon
        : item.kind === "contact" ? ContactIcon : HomeIcon;

  return (
    <span className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-sm border ${
      active ? "border-white/75 bg-white text-black" : "border-white/15 bg-white/5 text-white/55"
    }`} aria-hidden="true">
      <Icon className="h-4 w-4" />
    </span>
  );
}
