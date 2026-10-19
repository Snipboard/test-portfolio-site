"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NEUTRAL_SHOWCASE } from "@/lib/showcase";
import type { XmbCategory, XmbItem } from "./types";

export function XmbSceneLayer({ category, item, reduced = false }: { category: XmbCategory; item?: XmbItem; reduced?: boolean }) {
  const showcase = item?.showcase;
  const artwork = showcase?.artworkUrl ?? item?.image ?? item?.gallery?.[0];
  const layout = showcase?.layout ?? (item?.kind === "project" ? "media-led" : "minimal");
  const mediaFit = showcase?.mediaFit ?? NEUTRAL_SHOWCASE.mediaFit;
  const mediaPosition = showcase?.mediaPosition ?? NEUTRAL_SHOWCASE.mediaPosition;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div key={`${category.id}-${item?.id ?? "empty"}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.52, ease: "easeInOut" }}
          className={`psp-showcase-scene psp-showcase-${layout} absolute inset-0`}
          data-motif={showcase?.motif ?? "none"}
          data-motion={reduced ? "none" : showcase?.motionStyle ?? "none"}>
          {showcase?.backgroundUrl && <div className="psp-showcase-background" style={{ backgroundImage: `url("${showcase.backgroundUrl}")` }} />}
          <div className="psp-showcase-light" style={{ backgroundColor: showcase?.ambientColor ?? NEUTRAL_SHOWCASE.ambientColor }} />
          {artwork && <div className="psp-showcase-artwork">
            {/* Remote Atlas and Contentful media can use different hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artwork} alt="" style={{ objectFit: mediaFit, objectPosition: mediaPosition }} />
          </div>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
