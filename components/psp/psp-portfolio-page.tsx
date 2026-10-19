"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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
      // An in-place history entry lets browser Back restore the browse state.
      window.history.pushState(
        { ...window.history.state, __portfolioFocusItem: item.id },
        "",
        window.location.href,
      );
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

  const closeExpandedItem = useCallback(() => {
    if (expandedItem && window.history.state?.__portfolioFocusItem === expandedItem.id) {
      window.history.back();
    } else {
      setExpandedItem(null);
    }
  }, [expandedItem]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (expandedItem) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeExpandedItem();
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
    [activeCategoryIndex, categoryItemsLength, activeItem, categories.length, activateItem, expandedItem, closeExpandedItem]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const onPopState = () => {
      const id = window.history.state?.__portfolioFocusItem;
      const categoryIndex = categories.findIndex((category) => category.items.some((item) => item.id === id));
      if (categoryIndex < 0) {
        setExpandedItem(null);
        return;
      }
      const items = categories[categoryIndex].items;
      const itemIndex = items.findIndex((item) => item.id === id);
      setActiveCategoryIndex(categoryIndex);
      setActiveItemIndices((previous) => ({ ...previous, [categoryIndex]: itemIndex }));
      setExpandedItem(items[itemIndex]);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [categories]);

  useEffect(() => {
    if (!expandedItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedItem]);

  const siteName = [hero.firstName, hero.lastName].filter(Boolean).join(" ");
  const focusOpen = expandedItem !== null;
  const foldingTransition = { duration: 0.44, ease: [0.22, 1, 0.36, 1] as const };

  const themeStyle = {
    ...getPspThemeStyle(activeItem?.showcase),
    ["--psp-bg" as string]: NEUTRAL_SHOWCASE.backgroundColor,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="psp-theme-root" style={themeStyle}>
        <div className="block lg:hidden">
          <div inert={focusOpen} aria-hidden={focusOpen}>
            <PspMobileView
              categories={categories}
              contact={contact}
              name={siteName}
              activeCategoryIndex={activeCategoryIndex}
              activeItemIndex={activeItemIndex}
              onCategorySelect={selectCategory}
              onItemSelect={selectItem}
              onItemActivate={activateItemAtIndex}
            />
          </div>
          <AnimatePresence initial={false}>
            {expandedItem && (
              <XmbExpandedDetail
                key={expandedItem.id}
                item={expandedItem}
                variant="mobile"
                siteName={siteName}
                onClose={closeExpandedItem}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="psp-shell psp-browse-shell fixed inset-0 z-40 hidden select-none overflow-hidden text-white lg:block">
          <XmbHeader name={siteName} contact={contact} />

          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            inert={focusOpen}
            aria-hidden={focusOpen}
            animate={{ y: focusOpen ? -65 : 0, opacity: focusOpen ? 0 : 1 }}
            transition={foldingTransition}
            style={{ pointerEvents: focusOpen ? "none" : "auto" }}
          >
            <XmbHorizontalAxis
              categories={categories}
              activeCategoryIndex={activeCategoryIndex}
              onCategorySelect={selectCategory}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-10"
            inert={focusOpen}
            aria-hidden={focusOpen}
            animate={{ y: focusOpen ? -110 : 0, opacity: focusOpen ? 0 : 1 }}
            transition={foldingTransition}
            style={{ pointerEvents: focusOpen ? "none" : "auto" }}
          >
            <XmbVerticalAxis
              items={activeCategory.items}
              activeItemIndex={activeItemIndex}
              onItemSelect={selectItem}
              onItemActivate={activateItemAtIndex}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-10"
            inert={focusOpen}
            aria-hidden={focusOpen}
            animate={{ x: focusOpen ? -60 : 0, opacity: focusOpen ? 0 : 1 }}
            transition={foldingTransition}
            style={{ pointerEvents: focusOpen ? "none" : "auto" }}
          >
            <XmbDetailPanel
              activeItem={activeItem}
              onActivate={activeItem?.activationLabel ? () => activateItem(activeItem) : undefined}
            />
          </motion.div>

          <motion.p
            aria-hidden={focusOpen}
            className="pointer-events-none absolute bottom-8 right-[var(--psp-edge)] z-10 text-xs text-white/35"
            animate={{ opacity: focusOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            Arrow keys to browse · Enter to open
          </motion.p>

          <AnimatePresence initial={false}>
            {expandedItem && (
              <XmbExpandedDetail
                key={expandedItem.id}
                item={expandedItem}
                variant="desktop"
                siteName={siteName}
                onClose={closeExpandedItem}
              />
            )}
          </AnimatePresence>

          <p className="sr-only" aria-live="polite">
            {expandedItem ? `Open: ${expandedItem.title}` : `${activeCategory.label}: ${activeItem?.title}`}
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}
