import assert from "node:assert/strict";
import test from "node:test";

import { getPortfolioContent, getFallbackPortfolioContent } from "../lib/contentful.ts";

async function withAtlasFetch(run: () => Promise<void>) {
  const previousFetch = global.fetch;
  const previousUrl = process.env.ATLAS_PORTFOLIO_URL;
  const previousSpace = process.env.CONTENTFUL_SPACE_ID;
  const previousToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  process.env.ATLAS_PORTFOLIO_URL = "https://atlas.example.test/api/public/portfolio";
  delete process.env.CONTENTFUL_SPACE_ID;
  delete process.env.CONTENTFUL_DELIVERY_TOKEN;
  try {
    await run();
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.ATLAS_PORTFOLIO_URL;
    else process.env.ATLAS_PORTFOLIO_URL = previousUrl;
    if (previousSpace === undefined) delete process.env.CONTENTFUL_SPACE_ID;
    else process.env.CONTENTFUL_SPACE_ID = previousSpace;
    if (previousToken === undefined) delete process.env.CONTENTFUL_DELIVERY_TOKEN;
    else process.env.CONTENTFUL_DELIVERY_TOKEN = previousToken;
  }
}

test("prefers the published Atlas portfolio and maps its public API contract", async () => {
  await withAtlasFetch(async () => {
    let requests = 0;
    global.fetch = (async (input) => {
      requests++;
      assert.equal(new URL(String(input)).hostname, "atlas.example.test");
      return new Response(JSON.stringify({
        hero: { firstName: "Atlas", lastName: "User", description: "Hello" },
        contact: { email: "atlas@example.com", githubUrl: "https://github.com/example" },
        work: Array.from({ length: 4 }, (_, i) => ({ title: `Example Project ${i}`, slug: `example-project-${i}`, year: "2026", summary: "Project summary", gallery: ["https://example.com/gallery.png"], image: "https://example.com/project.png", tags: ["TS"] })),
        experience: Array.from({ length: 2 }, (_, i) => ({ company: `Example Inc ${i}`, role: "Engineer", period: "2026", description: "Built tools" })),
        posts: Array.from({ length: 4 }, (_, i) => ({ title: `My Post ${i}`, slug: `my-post-${i}`, body: "Real post body", excerpt: "Excerpt", publishedAt: "2026-10-01T00:00:00.000Z" })),
        collections: Array.from({ length: 4 }, (_, i) => ({ key: i === 0 ? "ai-tools" : `collection-${i}`, title: `AI Tools ${i}`, section: "projects", slug: `collection-${i}`, order: i + 1 })),
      }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof fetch;

    const content = await getPortfolioContent();
    assert.equal(requests, 1);
    assert.equal(content.hero.firstName, "Atlas");
    assert.equal(content.contact.email, "atlas@example.com");
    assert.equal(content.workItems[0]?.image, "https://example.com/project.png");
    assert.deepEqual(content.workItems[0]?.gallery, ["https://example.com/gallery.png"]);
    assert.equal(content.posts[0]?.body, "Real post body");
    assert.equal(content.posts[0]?.publishedAt, "October 2026");
    assert.equal(content.hero.tagline, "");
    assert.equal(content.collections[0]?.id, "ai-tools");
  });
});

test("empty Atlas draft corpus leaves the currently deployed site intact", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response(JSON.stringify({
      hero: null, contact: null, work: [], experience: [], posts: [], collections: [],
    }), { status: 200 })) as typeof fetch;
    assert.deepEqual(await getPortfolioContent(), getFallbackPortfolioContent());
  });
});

test("unavailable Atlas still allows the previous provider fallback", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response(null, { status: 503 })) as typeof fetch;
    assert.deepEqual(await getPortfolioContent(), getFallbackPortfolioContent());
  });
});
