import assert from "node:assert/strict";
import test from "node:test";

import { getPortfolioContent } from "../lib/atlas.ts";

async function withAtlasFetch(run: () => Promise<void>) {
  const previousFetch = global.fetch;
  const previousUrl = process.env.ATLAS_PORTFOLIO_URL;
  process.env.ATLAS_PORTFOLIO_URL = "https://atlas.example.test/api/public/portfolio";
  try {
    await run();
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.ATLAS_PORTFOLIO_URL;
    else process.env.ATLAS_PORTFOLIO_URL = previousUrl;
  }
}

const published = {
  hero: { firstName: "Atlas", lastName: "User", description: "Hello" },
  contact: { email: "atlas@example.com", githubUrl: "https://github.com/example" },
  work: [
    { title: "New Project", slug: "new-project", year: "2026", summary: "Project summary",
      gallery: ["https://example.com/gallery.png"], image: "https://example.com/project.png",
      tags: ["TS"], showcase: { accentColor: "#ee4433", layout: "media-led", artworkUrl: "https://atlas.example.test/media/image" },
      links: [
        { label: "Demo", url: "https://example.com/demo" },
        { label: "Unsafe", url: "javascript:alert(1)" },
      ],
    },
    { title: "Another Project", slug: "another-project", year: "2025", summary: "Another project",
      showcase: { accentColor: "red", layout: "script", artworkUrl: "javascript:bad" } },
  ],
  experience: [{ company: "Example Inc", role: "Engineer", period: "2026", description: "Built tools",
    showcase: { accentColor: "#77aa88", layout: "editorial" } }],
  posts: [{ title: "My Post", slug: "my-post", body: "Real post body", excerpt: "Excerpt", publishedAt: "2026-10-01T00:00:00.000Z" }],
  collections: [{ key: "ai-tools", title: "AI Tools", section: "blog", slug: "ai-tools", order: 1 }],
};

test("uses published Atlas content and validates showcase metadata without fixed inventory thresholds", async () => {
  await withAtlasFetch(async () => {
    let requests = 0;
    global.fetch = (async (input, init) => {
      requests++;
      assert.equal(new URL(String(input)).hostname, "atlas.example.test");
      assert.equal(init?.cache, "no-store");
      return new Response(JSON.stringify(published), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof fetch;

    const content = await getPortfolioContent();
    assert.equal(requests, 1);
    assert.equal(content.hero.firstName, "Atlas");
    assert.equal(content.hero.tagline, "");
    assert.equal(content.workItems.length, 2);
    assert.equal(content.workItems[0]?.image, "https://example.com/project.png");
    assert.deepEqual(content.workItems[0]?.showcase, {
      accentColor: "#ee4433", layout: "media-led", artworkUrl: "https://atlas.example.test/media/image",
    });
    assert.equal(content.workItems[1]?.showcase, undefined);
    assert.deepEqual(content.experience[0]?.showcase, { accentColor: "#77aa88", layout: "editorial" });
    assert.deepEqual(content.workItems[0]?.gallery, ["https://example.com/gallery.png"]);
    assert.deepEqual(content.workItems[0]?.links, [{ label: "Demo", url: "https://example.com/demo" }]);
    assert.equal(content.posts[0]?.publishedAt, "October 2026");
    assert.equal(content.collections[0]?.id, "ai-tools");
  });
});

test("valid empty sections are rendered without requiring the old provider inventory", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response(JSON.stringify({
      hero: published.hero, contact: published.contact,
      work: [], experience: [], posts: [], collections: [],
    }), { status: 200 })) as typeof fetch;
    const content = await getPortfolioContent();
    assert.equal(content.workItems.length, 0);
    assert.equal(content.experience.length, 0);
    assert.equal(content.posts.length, 0);
    assert.equal(content.collections.length, 0);
  });
});

test("unavailable Atlas fails clearly instead of silently returning Contentful content", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response(null, { status: 503 })) as typeof fetch;
    await assert.rejects(getPortfolioContent(), /Atlas portfolio API returned HTTP 503/);
  });
});

test("missing published profile fails clearly", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response(JSON.stringify({
      ...published, hero: null,
    }), { status: 200 })) as typeof fetch;
    await assert.rejects(getPortfolioContent(), /invalid payload structure/);
  });
});

test("invalid JSON and network failures surface Atlas errors", async () => {
  await withAtlasFetch(async () => {
    global.fetch = (async () => new Response("not-json", { status: 200 })) as typeof fetch;
    await assert.rejects(getPortfolioContent(), /invalid JSON/);
    global.fetch = (async () => { throw new Error("network down"); }) as typeof fetch;
    await assert.rejects(getPortfolioContent(), /Could not reach the Atlas portfolio API/);
  });
});
