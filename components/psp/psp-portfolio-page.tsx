"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioContact,
  PortfolioExperience,
  PortfolioPost,
  PortfolioCollection,
} from "@/lib/portfolio-types";
import { buildXmbCategories } from "./psp-config";
import { XmbHeader } from "./xmb-header";
import { XmbHorizontalAxis } from "./xmb-horizontal-axis";
import { XmbVerticalAxis } from "./xmb-vertical-axis";
import { XmbDetailPanel } from "./xmb-detail-panel";
import { PspMobileView } from "./psp-mobile-view";
import { XmbExpandedDetail } from "./xmb-expanded-detail";
import { getPspThemeStyle } from "./psp-showcase-style";
import type { XmbItem } from "./types";
import { NEUTRAL_SHOWCASE } from "@/lib/showcase";

interface PspPortfolioPageProps {
  workItems: PortfolioWork[];
  hero: PortfolioHero;
  contact: PortfolioContact;
  experienceItems: PortfolioExperience[];
  posts: PortfolioPost[];
  collections: PortfolioCollection[];
}

export function PspPortfolioPage({
  workItems,
  hero,
  contact,
  experienceItems,
  posts,
  collections,
}: PspPortfolioPageProps) {
  const [expandedItem, setExpandedItem] = useState<XmbItem | null>(null);

  const categories = useMemo(
    () => buildXmbCategories({
      hero,
      workItems,
      experienceItems,
      posts,
      collections,
    }),
    [hero, workItems, experienceItems, posts, collections]
  );

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndices, setActiveItemIndices] = useState<Record<number, number>>(
    () => Object.fromEntries(categories.map((_, i) => [i, 0]))
  );

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];
  const activeItemIndex = activeItemIndices[activeCategoryIndex] ?? 0;
  const activeItem = activeCategory?.items?.[activeItemIndex];
  const categoryItemsLength = activeCategory?.items?.length ?? 0;

  const selectCategory = useCallback((index: number) => {
    setActiveCategoryIndex(index);
  }, []);

  const selectItem = useCallback((index: number) => {
    setActiveItemIndices((previous) => ({ ...previous, [activeCategoryIndex]: index }));
  }, [activeCategoryIndex]);

  const activateItem = useCallback((item?: XmbItem) => {
    if (!item) return;

    if (item.detailHref) {
      setExpandedItem(item);
      return;
    }

    if (item.href && item.href !== "#") {
      if (item.downloadName) {
        const link = document.createElement("a");
        link.href = item.href;
        link.download = item.downloadName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
        return;
      }

      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
    }
  }, [activeCategoryIndex]);

  const activateItemAtIndex = useCallback((index: number) => {
    activateItem(activeCategory?.items[index]);
  }, [activateItem, activeCategory]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (expandedItem) {
        if (event.key === "Escape") {
          event.preventDefault();
          setExpandedItem(null);
        }
        return;
      }

      // Let focused social links handle Enter and arrow keys normally.
      if (event.target instanceof HTMLElement && event.target.closest("a")) return;

      const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
      if (!navKeys.includes(event.key)) return;
      event.preventDefault();

      if (event.key === "ArrowLeft") {
        setActiveCategoryIndex((previous) => Math.max(0, previous - 1));
      } else if (event.key === "ArrowRight") {
        setActiveCategoryIndex((previous) => Math.min(categories.length - 1, previous + 1));
      } else if (event.key === "ArrowUp") {
        setActiveItemIndices((previous) => ({
          ...previous,
          [activeCategoryIndex]: Math.max(0, (previous[activeCategoryIndex] ?? 0) - 1),
        }));
      } else if (event.key === "ArrowDown") {
        setActiveItemIndices((previous) => ({
          ...previous,
          [activeCategoryIndex]: Math.min(
            Math.max(0, categoryItemsLength - 1),
            (previous[activeCategoryIndex] ?? 0) + 1
          ),
        }));
      } else if (event.key === "Enter") {
        activateItem(activeItem);
      }
    },
    [activeCategoryIndex, categoryItemsLength, activeItem, categories.length, activateItem, expandedItem]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!expandedItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedItem]);

  const themeStyle = {
    ...getPspThemeStyle(activeItem?.showcase),
    ["--psp-bg" as string]: NEUTRAL_SHOWCASE.backgroundColor,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="psp-theme-root" style={themeStyle}>
        <div className="block lg:hidden">
          <PspMobileView
            categories={categories}
            contact={contact}
            name={`${hero.firstName} ${hero.lastName}`}
            activeCategoryIndex={activeCategoryIndex}
            activeItemIndex={activeItemIndex}
            onCategorySelect={selectCategory}
            onItemSelect={selectItem}
            onItemActivate={activateItemAtIndex}
          />
        </div>

        <div className="psp-shell psp-browse-shell fixed inset-0 z-40 hidden select-none overflow-hidden text-white lg:block">
          <XmbHeader name={`${hero.firstName} ${hero.lastName}`} contact={contact} />

          <XmbHorizontalAxis
            categories={categories}
            activeCategoryIndex={activeCategoryIndex}
            onCategorySelect={selectCategory}
          />

          <XmbVerticalAxis
            items={activeCategory.items}
            activeItemIndex={activeItemIndex}
            onItemSelect={selectItem}
            onItemActivate={activateItemAtIndex}
          />

          <XmbDetailPanel
            activeItem={activeItem}
            onActivate={activeItem?.activationLabel ? () => activateItem(activeItem) : undefined}
          />

          <p className="absolute bottom-8 right-[var(--psp-edge)] z-20 text-xs text-white/35">
            Arrow keys to browse · Enter to open
          </p>

          <p className="sr-only" aria-live="polite">
            {activeCategory.label}: {activeItem?.title}
          </p>
        </div>

        <AnimatePresence>
          {expandedItem && (
            <XmbExpandedDetail item={expandedItem} onClose={() => setExpandedItem(null)} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
