"use client";

import type { XmbItem } from "./types";
import { XmbItemIcon } from "./xmb-item-icon";

interface XmbVerticalAxisProps {
  items: XmbItem[];
  activeItemIndex: number;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number) => void;
}

type RailGroup = {
  key: string;
  title?: string;
  entries: { item: XmbItem; index: number }[];
};

const FOLDER_ROW_HEIGHT = 56;
const SINGLE_ROW_HEIGHT = 44;
const HEADING_HEIGHT = 40;
const GROUP_GAP = 24;
const SINGLE_ITEM_GAP = 4;
const ABOVE_AXIS_GAP = 26;
const COLLAPSED_HEADING_HEIGHT = 28;
const COLLAPSED_FOLDER_GAP = 8;

export function XmbVerticalAxis({
  items,
  activeItemIndex,
  onItemSelect,
  onItemActivate,
}: XmbVerticalAxisProps) {
  // An item without folder metadata is its own group, retaining the usual XMB
  // one-item-at-a-time behaviour. Folder members share a non-selectable heading.
  const groups: RailGroup[] = [];
  items.forEach((item, index) => {
    const key = item.groupId ? `folder:${item.groupId}` : `item:${item.id}:${index}`;
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, title: item.groupTitle, entries: [] };
      groups.push(group);
    }
    group.entries.push({ item, index });
  });

  const rowHeight = (group: RailGroup) =>
    group.title ? FOLDER_ROW_HEIGHT : SINGLE_ROW_HEIGHT;
  const gapBetween = (before: RailGroup, after: RailGroup) =>
    !before.title && !after.title ? SINGLE_ITEM_GAP : GROUP_GAP;

  const groupHeights = groups.map(
    (group) => group.entries.length * rowHeight(group) + (group.title ? HEADING_HEIGHT : 0)
  );
  // Only folder headings remain above the XMB when navigating into later
  // folders. Sections without folders retain their original behaviour.
  const compactPreviousFolders = groups.some((group) => Boolean(group.title));
  const activeGroupIndex = Math.max(
    0,
    groups.findIndex((group) => group.entries.some(({ index }) => index === activeItemIndex))
  );
  const activeGroup = groups[activeGroupIndex];
  const selectedPosition = Math.max(
    0,
    activeGroup?.entries.findIndex(({ index }) => index === activeItemIndex) ?? 0
  );

  // Keep the whole active folder below the XMB icons whenever it fits. For
  // unusually long folders, move just far enough for the selected row to show.
  const selectedRowBottom =
    (activeGroup?.title ? HEADING_HEIGHT : 0) + (selectedPosition + 1) * (activeGroup ? rowHeight(activeGroup) : SINGLE_ROW_HEIGHT);
  const activeGroupTop = `min(calc(var(--psp-axis-top) + var(--psp-row-offset)), calc(100dvh - var(--psp-rail-bottom) - ${selectedRowBottom}px))`;

  function topForGroup(groupIndex: number): string {
    if (groupIndex === activeGroupIndex) return activeGroupTop;

    if (groupIndex < activeGroupIndex) {
      if (compactPreviousFolders) {
        // Compress prior folders to a heading-only history, keeping the most
        // recently visited folder closest to the horizontal icon row.
        let folderCount = 0;
        for (let i = groupIndex; i < activeGroupIndex; i++) {
          if (groups[i].title) folderCount++;
        }
        const offset =
          ABOVE_AXIS_GAP +
          folderCount * COLLAPSED_HEADING_HEIGHT +
          Math.max(0, folderCount - 1) * COLLAPSED_FOLDER_GAP;
        return `calc(var(--psp-axis-top) - ${offset}px)`;
      }

      let offset = ABOVE_AXIS_GAP;
      for (let i = groupIndex; i < activeGroupIndex; i++) {
        offset += groupHeights[i];
        if (i < activeGroupIndex - 1) offset += gapBetween(groups[i], groups[i + 1]);
      }
      return `calc(var(--psp-axis-top) - ${offset}px)`;
    }

    let offset = groupHeights[activeGroupIndex] + gapBetween(groups[activeGroupIndex], groups[activeGroupIndex + 1]);
    for (let i = activeGroupIndex + 1; i < groupIndex; i++) {
      offset += groupHeights[i] + gapBetween(groups[i], groups[i + 1]);
    }
    return `calc(${activeGroupTop} + ${offset}px)`;
  }

  // Fade the list out before it reaches the reserved header space, and
  // disappear behind the horizontal icon band without underlaying either.
  const axisBandMask =
    "linear-gradient(to bottom, transparent 0, transparent calc(var(--psp-header-safe-bottom) - .75rem), black var(--psp-header-safe-bottom), black calc(var(--psp-axis-top) - 10px), transparent var(--psp-axis-top), transparent calc(var(--psp-axis-top) + 7rem), black calc(var(--psp-axis-top) + 7rem), black calc(100% - 2rem), transparent 100%)";

  return (
    <nav
      className="psp-xmb-rail pointer-events-none absolute inset-0 z-10 overflow-hidden"
      style={{ maskImage: axisBandMask, WebkitMaskImage: axisBandMask }}
      aria-label="Items in selected section"
    >
      {groups.map((group, groupIndex) => {
        const compact = compactPreviousFolders && groupIndex < activeGroupIndex;
        // Ungrouped items do not appear in the folder-history region.
        if (compact && !group.title) return null;

        return (
          <div
            key={group.key}
            className="psp-xmb-group pointer-events-none absolute"
            style={{
              top: topForGroup(groupIndex),
              transition: "top 210ms cubic-bezier(0.2, 0.75, 0.3, 1)",
            }}
          >
            {group.title && (
              <h3 className={`flex ${compact ? "h-7" : "h-10"} items-center gap-2 truncate text-xs font-medium uppercase tracking-[0.16em] text-white/40`}>
                <span className="h-px w-3 shrink-0 bg-white/25" aria-hidden="true" />
                <span className="truncate">{group.title}</span>
              </h3>
            )}
            {!compact && (
              <div className={group.title ? "psp-xmb-group-entries" : undefined}>
                {group.entries.map(({ item, index }) => {
                  const active = index === activeItemIndex;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => active ? onItemActivate(index) : onItemSelect(index)}
                      aria-current={active ? "true" : undefined}
                      className={`psp-xmb-item pointer-events-auto relative flex w-full cursor-pointer items-center gap-4 rounded-sm py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)] ${group.title ? "pl-5" : ""} ${group.title ? "h-14" : "h-11"} ${
                        active ? "font-semibold text-white" : "text-white/55 hover:text-white"
                      }`}
                      style={{ fontFamily: item.fontFamily }}
                    >
                      <XmbItemIcon item={item} active={active} />
                      <span className={`min-w-0 truncate ${active ? "text-xl" : "text-base"}`}>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
