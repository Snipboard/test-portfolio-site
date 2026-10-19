import assert from "node:assert/strict";
import test from "node:test";

import { getCollectionView } from "../lib/portfolio-collections.ts";
import type { PortfolioCollection } from "../lib/portfolio-types.ts";

const collections: PortfolioCollection[] = [
  { id: "apps", title: "Apps", slug: "apps", section: "projects", description: "", order: 1 },
  { id: "labs", title: "Labs", slug: "labs", section: "projects", description: "", order: 2 },
  { id: "notes", title: "Notes", slug: "notes", section: "blog", description: "", order: 1 },
];

const entries = [
  { title: "App one", collectionId: "apps" },
  { title: "App two", collectionId: "apps" },
  { title: "Loose project" },
  { title: "Bad reference", collectionId: "missing" },
];

test("builds folders only for the requested section and non-empty collections", () => {
  const view = getCollectionView("projects", collections, null, entries);

  assert.deepEqual(view.folders.map(({ collection, count }) => [collection.id, count]), [["apps", 2]]);
});

test("keeps unassigned and invalidly assigned entries at the section root", () => {
  const view = getCollectionView("projects", collections, null, entries);

  assert.deepEqual(view.ungrouped.map((entry) => entry.title), ["Loose project", "Bad reference"]);
});

test("returns the entries inside an open collection", () => {
  const view = getCollectionView("projects", collections, "apps", entries);

  assert.equal(view.openCollection?.title, "Apps");
  assert.deepEqual(view.contained.map((entry) => entry.title), ["App one", "App two"]);
});

test("does not open a collection belonging to another section", () => {
  const view = getCollectionView("projects", collections, "notes", entries);

  assert.equal(view.openCollection, undefined);
  assert.deepEqual(view.contained, []);
});
