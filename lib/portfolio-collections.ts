import type { PortfolioCollection } from "./portfolio-types.ts";

export type CollectionEntry = { collectionId?: string };

export function getCollectionView<T extends CollectionEntry>(
  section: PortfolioCollection["section"],
  collections: PortfolioCollection[],
  openCollectionId: string | null,
  entries: T[],
) {
  const sectionCollections = collections.filter((collection) => collection.section === section);
  const validIds = new Set(sectionCollections.map((collection) => collection.id));
  const openCollection = sectionCollections.find((collection) => collection.id === openCollectionId);

  return {
    openCollection,
    contained: openCollection
      ? entries.filter((entry) => entry.collectionId === openCollection.id)
      : [],
    folders: sectionCollections
      .map((collection) => ({
        collection,
        count: entries.filter((entry) => entry.collectionId === collection.id).length,
      }))
      .filter((folder) => folder.count > 0),
    ungrouped: entries.filter((entry) => !entry.collectionId || !validIds.has(entry.collectionId)),
  };
}
