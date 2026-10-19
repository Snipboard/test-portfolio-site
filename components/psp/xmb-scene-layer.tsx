import type { XmbItem } from "./types";

export function XmbSceneLayer({ item }: { item?: XmbItem }) {
  if (item?.kind !== "project") return null;
  const artwork = item.showcase?.artworkUrl ?? item.image;
  if (!artwork) return null;

  return (
    <div className="pointer-events-none absolute right-[8%] top-[9%] z-0 flex h-[23%] w-[30%] items-center justify-end overflow-hidden" aria-hidden="true">
      {/* Atlas and imported media can be hosted on different domains. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork} alt="" className="max-h-full max-w-full object-contain opacity-80" />
    </div>
  );
}
